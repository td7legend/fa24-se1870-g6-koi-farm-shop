using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Responses;
using koi_farm_demo.Models;

namespace koi_farm_demo.Services
{
    public interface IUserService
    {
        Task<string> GetEmailByUserIdAsync(int userId);
        Task ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        Task<TokenResult> GetTokenFromGoogle(string code);
        Task<User> GetUserFromGoogleAsync(string idToken);
        Task<string> LoginWithGoogleAsync();
        Task RegisterCustomerAsync(RegisterCustomerModel model);
        Task AddStaffAsync(string email, string password, string fullName, string phoneNumber, string role);
        Task<string> LoginAsync(string email, string password);
        Task<bool> IsEmailTakenAsync(string email);
        Task ResetPasswordAsync(string email, string newPassword);
    }

}
