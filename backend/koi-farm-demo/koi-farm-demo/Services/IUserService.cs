using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Responses;
using koi_farm_demo.Models;

namespace koi_farm_demo.Services
{
    public interface IUserService
    {
        Task<TokenResult> GetTokenFromGoogle(string code);
        Task<User> GetUserFromGoogleAsync(string idToken);
        Task<string> LoginWithGoogleAsync();
        Task RegisterCustomerAsync(RegisterCustomerModel model);
        Task AddStaffAsync(string username, string password, Staff staff, int managerId);
        Task<string> LoginAsync(string username, string password);
        
    }

}
