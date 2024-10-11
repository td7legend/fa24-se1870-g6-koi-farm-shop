using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly KoiFarmDbContext _context;

        public UserRepository(KoiFarmDbContext context)
        {
            _context = context;
        }
        public async Task<User> GetUserByGoogleIdAsync(string googleId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        
    }
}
