using Google.Apis.Auth;
using koi_farm_demo.Models;

namespace koi_farm_demo.Services
{
    public interface IUserService
    {
        Task<User> GetUserFromGoogleAsync(string idToken);
        Task<string> LoginWithGoogleAsync();
        Task RegisterCustomerAsync(RegisterCustomerModel model);
        Task AddStaffAsync(string username, string password, Staff staff, int managerId);
        Task<string> LoginAsync(string username, string password);
        
    }

}
