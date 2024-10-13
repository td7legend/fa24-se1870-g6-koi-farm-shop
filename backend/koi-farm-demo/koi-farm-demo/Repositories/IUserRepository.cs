namespace koi_farm_demo.Repositories
{
    public interface IUserRepository
    {
        Task UpdateUserAsync(User user);
        Task<User> GetUserByIdAsync(int userId);
        Task<User> GetUserByUsernameAsync(string email);
        Task AddUserAsync(User user);
        Task<User> GetUserByGoogleIdAsync(string googleId);
        Task<bool> EmailExistsAsync(string email);

    }
}
