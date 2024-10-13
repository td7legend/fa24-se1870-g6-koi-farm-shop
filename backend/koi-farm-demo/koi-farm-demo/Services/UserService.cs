using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Responses;
using koi_farm_demo.Models;
using koi_farm_demo.Repositories;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace koi_farm_demo.Services
{
    public class UserService : IUserService
    {
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IConfiguration _configuration;
        private readonly ICustomerRepository _customerRepository;
        private readonly HttpClient _httpClient;

        public UserService(IUserRepository userRepository, IStaffRepository staffRepository, IConfiguration configuration, ICustomerRepository customerRepository, HttpClient httpClient)
        {
            _userRepository = userRepository;
            _staffRepository = staffRepository;
            _configuration = configuration;
            _customerRepository = customerRepository;
            _httpClient = httpClient;
        }

        public async Task RegisterCustomerAsync(RegisterCustomerModel model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var existingUser = await _userRepository.GetUserByUsernameAsync(model.Email);
            if (existingUser != null) throw new Exception("Username already exists");

            // Băm mật khẩu
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // Tạo người dùng mới
            var newUser = new User
            {
                Email = model.Email,
                HashPassword = hashedPassword,
                Role = UserRole.Customer
            };

            // Lưu người dùng vào repository
            await _userRepository.AddUserAsync(newUser);

            // Tạo và lưu thông tin khách hàng
            var customer = new Customer
            {
                FullName = model.FullName,
                Address = model.Address,
                UserId = newUser.UserId, // Gán UserId cho khách hàng
                                         // Khởi tạo các thuộc tính khác nếu cần thiết
            };

            await _customerRepository.AddAsync(customer); // Lưu khách hàng vào repository
        }

        public async Task AddStaffAsync(string email, string password, Staff staff, int managerId)
        {
            var manager = await _userRepository.GetUserByIdAsync(managerId);
            if (manager == null || manager.Role != UserRole.Manager)
            {
                throw new UnauthorizedAccessException("Only manager can add staff.");
            }

            var existingUser = await _userRepository.GetUserByUsernameAsync(email);
            if (existingUser != null) throw new Exception("Username already exists");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            var newUser = new User
            {
                Email = email,
                HashPassword = hashedPassword,
                Role = UserRole.Staff
            };

            await _userRepository.AddUserAsync(newUser);
            staff.User = newUser;
            await _staffRepository.AddStaffAsync(staff);
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetUserByUsernameAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.HashPassword))
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public async Task<string> LoginWithGoogleAsync()
        {
            var redirectUri = $"{_configuration["AppUrl"]}/api/User/login/google/callback";
            var url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={_configuration["GoogleOAuth:ClientId"]}&redirect_uri={redirectUri}&response_type=code&scope=email%20profile%20openid&access_type=offline";

            return url;
        }

        public async Task<User> GetUserFromGoogleAsync(string idToken)
        {
            var payload = await VerifyGoogleToken(idToken);
            var user = await _userRepository.GetUserByGoogleIdAsync(payload.Subject);
            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    HashPassword = "",
                    Role = UserRole.Customer,
                    GoogleId = payload.Subject
                };
                await _userRepository.AddUserAsync(user);
            }
            return user;
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string idToken)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _configuration["GoogleOAuth:ClientId"] }
            };
            return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }

        public async Task<TokenResult> GetTokenFromGoogle(string code)
        {
            var tokenRequest = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", _configuration["GoogleOAuth:ClientId"] },
                { "client_secret", _configuration["GoogleOAuth:ClientSecret"] },
                { "redirect_uri", $"{_configuration["AppUrl"]}/api/User/login/google/callback" },
                { "grant_type", "authorization_code" }
            };

            var requestContent = new FormUrlEncodedContent(tokenRequest);
            var response = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", requestContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Invalid token response: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<TokenResult>(responseContent);
            if (string.IsNullOrEmpty(tokenResponse?.IdToken))
            {
                throw new Exception("Id token is null or empty.");
            }

            return tokenResponse;
        }
        public async Task ChangePasswordAsync(int userId, string oldPassword, string newPassword)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) throw new Exception("User not found");

            if (!BCrypt.Net.BCrypt.Verify(oldPassword, user.HashPassword))
            {
                throw new UnauthorizedAccessException("Old password is incorrect");
            }

            var hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.HashPassword = hashedNewPassword;

            await _userRepository.UpdateUserAsync(user);
        }
        public async Task<bool> IsEmailTakenAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }
        public async Task ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _userRepository.GetUserByUsernameAsync(email);
            if (user == null) throw new Exception("User not found");

            var hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.HashPassword = hashedNewPassword;

            await _userRepository.UpdateUserAsync(user);
        }


    }
}

        
    


