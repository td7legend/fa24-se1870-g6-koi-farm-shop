using koi_farm_demo.Models;
using koi_farm_demo.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Configuration;

namespace koi_farm_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;
        public UserController(IUserService userService, IConfiguration configuration, IJwtService jwtService)
        {
            _jwtService = jwtService;
            _configuration = configuration;
            _userService = userService;
        }

        [HttpPost("register-customer")]
        public async Task<IActionResult> RegisterCustomer([FromBody] RegisterCustomerModel model)
        {
            try
            {
                await _userService.RegisterCustomerAsync(model); 
                return Ok("Customer registered successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("add-staff")]
        public async Task<IActionResult> AddStaff([FromBody] AddStaffModel model)
        {
            try
            {
                var currentManagerId = GetCurrentUserId(); // Giả sử có phương thức để lấy thông tin người đăng nhập
                await _userService.AddStaffAsync(model.Username, model.Password, model.Staff, currentManagerId);
                return Ok("Staff added successfully.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var token = await _userService.LoginAsync(model.Username, model.Password);
                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value);
        }
        
        [HttpGet("login/google")]
        public IActionResult LoginWithGoogle()
        {
            var url = _userService.LoginWithGoogleAsync().Result;
            return Ok(new { url }); // Chuyển hướng đến Google để đăng nhập
        }

        [HttpGet("login/google/callback")]
        public async Task<IActionResult> GoogleCallback(string code)
        {
            // Sử dụng mã code để lấy access token và id token
            var tokenResponse = await GetTokenFromGoogle(code);
            var user = await _userService.GetUserFromGoogleAsync(tokenResponse.IdToken);
            var token = _jwtService.GenerateToken(user);

            return Ok(new { Token = token });
        }

        private async Task<TokenResponse> GetTokenFromGoogle(string code)
        {
            var clientId = _configuration["GoogleOAuth:ClientId"];
            var clientSecret = _configuration["GoogleOAuth:ClientSecret"];
            var redirectUri = $"{_configuration["AppUrl"]}/api/user/login/google/callback";

            // Gửi yêu cầu đến Google để lấy token
            // (Sử dụng HttpClient hoặc một thư viện khác để gửi yêu cầu POST đến Google)

            return new TokenResponse
            {
                IdToken = "your-id-token", // Lấy id token từ phản hồi Google
            };
        }
    }

    public class TokenResponse
    {
        public string IdToken { get; set; }
    }

}

