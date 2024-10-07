using Google.Apis.Auth;
using koi_farm_demo.Models;
using koi_farm_demo.Repositories;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace koi_farm_demo.Services
{
    public class UserService : IUserService
    {
        private readonly JwtService _jwtService;
        private readonly IUserRepository _userRepository;
        private readonly IStaffRepository _staffRepository;
        private readonly IConfiguration _configuration;
        private readonly ICustomerRepository _customerRepository;

        public UserService(IUserRepository userRepository, IStaffRepository staffRepository, IConfiguration configuration, ICustomerRepository customerRepository)
        {
            _userRepository = userRepository;
            _staffRepository = staffRepository;
            _configuration = configuration;
            _customerRepository = customerRepository;   
        }

        public async Task RegisterCustomerAsync(RegisterCustomerModel model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var existingUser = await _userRepository.GetUserByUsernameAsync(model.Username);
            if (existingUser != null) throw new Exception("Username already exists");

            // Băm mật khẩu
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // Tạo người dùng mới
            var newUser = new User
            {
                Username = model.Username,
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

        public async Task AddStaffAsync(string username, string password, Staff staff, int managerId)
        {
            var manager = await _userRepository.GetUserByIdAsync(managerId);
            if (manager == null || manager.Role != UserRole.Manager)
            {
                throw new UnauthorizedAccessException("Only manager can add staff.");
            }

            var existingUser = await _userRepository.GetUserByUsernameAsync(username);
            if (existingUser != null) throw new Exception("Username already exists");

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            var newUser = new User
            {
                Username = username,
                HashPassword = hashedPassword,
                Role = UserRole.Staff
            };

            await _userRepository.AddUserAsync(newUser);
            staff.User = newUser;
            await _staffRepository.AddStaffAsync(staff);
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
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
            // Tạo URL đăng nhập Google
            var redirectUri = $"{_configuration["AppUrl"]}/api/user/login/google/callback";
            var url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={_configuration["GoogleOAuth:ClientId"]}&redirect_uri={redirectUri}&response_type=code&scope=email%20profile&access_type=offline";

            // Chuyển hướng người dùng đến URL Google để đăng nhập
            return await Task.FromResult(url);
        }


        public async Task<User> GetUserFromGoogleAsync(string idToken)
        {
            var payload = await VerifyGoogleToken(idToken);
            var user = await _userRepository.GetUserByGoogleIdAsync(payload.Subject);
            if (user == null)
            {
                user = new User
                {
                    UserId = int.TryParse(payload.Subject, out var userId) ? userId : 0,
                    Username = payload.Email,
                    HashPassword = "", // Không cần mật khẩu cho Google login
                    Role = UserRole.Customer
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
    }
}
        
    


