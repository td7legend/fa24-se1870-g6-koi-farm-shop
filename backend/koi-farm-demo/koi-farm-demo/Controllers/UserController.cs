using koi_farm_demo.Models;
using koi_farm_demo.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Google.Apis.Auth.OAuth2.Responses;
using System.Net.Http;
using System.Threading.Tasks;
using Swashbuckle.AspNetCore.Annotations;

namespace koi_farm_demo.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;
        private readonly HttpClient _httpClient; // HttpClient

        public UserController(IUserService userService, IConfiguration configuration, IJwtService jwtService)
        {
            _jwtService = jwtService;
            _configuration = configuration;
            _userService = userService;
            _httpClient = new HttpClient(); // Khởi tạo HttpClient
        }

        [HttpPost("register")]
        [SwaggerOperation(Summary = "Register a new customer")]
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

        [HttpPost("staff")]
        [SwaggerOperation(Summary = "Add new staff")]
        public async Task<IActionResult> AddStaff([FromBody] AddStaffModel model)
        {
            try
            {
                var currentManagerId = GetCurrentUserId(); 
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
        [SwaggerOperation(Summary = "User login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var token = await _userService.LoginAsync(model.Email, model.Password);
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
        [SwaggerOperation(Summary = "Google login redirection")]
        public IActionResult LoginWithGoogle()
        {
            var url = _userService.LoginWithGoogleAsync().Result;
            return Ok(new { url });
        }

        [HttpGet("login/google/callback")]
        [SwaggerOperation(Summary = "Google login callback")]
        public async Task<IActionResult> GoogleCallback(string code)
        {
            try
            {
                var tokenResponse = await _userService.GetTokenFromGoogle(code);
                var user = await _userService.GetUserFromGoogleAsync(tokenResponse.IdToken);
                var token = _jwtService.GenerateToken(user);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while processing the callback: {ex.Message}");
            }
        }
        [HttpPost("change-password")]
        [SwaggerOperation(Summary = "Change password for authenticated users")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            try
            {
                var currentUserId = GetCurrentUserId(); 
                await _userService.ChangePasswordAsync(currentUserId, model.OldPassword, model.NewPassword);
                return Ok("Password changed successfully.");
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
        [HttpGet("check-email")]
        [SwaggerOperation(Summary = "Check if the email is already in use")]
        public async Task<IActionResult> CheckEmailExists(string email)
        {
            if (await _userService.IsEmailTakenAsync(email))
            {
                return BadRequest("Email already exists.");
            }

            return Ok("Email is available.");
        }
        [HttpPost("reset-password")]
        [SwaggerOperation(Summary = "Reset password for users who forgot their password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            try
            {
                await _userService.ResetPasswordAsync(model.Email, model.NewPassword);
                return Ok("Password reset successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
