namespace koi_farm_demo.Repositories
{
    public interface ILoyaltyPointRepository
    {
        Task<Customer> GetCustomerByIdAsync(int customerId);
        Task AddLoyaltyPointAsync(LoyaltyPoint loyaltyPoint);
        Task SaveChangesAsync();
    }

    public class LoyaltyPointRepository : ILoyaltyPointRepository
    {
        private readonly KoiFarmDbContext _context;

        public LoyaltyPointRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task<Customer> GetCustomerByIdAsync(int customerId)
        {
            return await _context.Customers.FindAsync(customerId);
        }

        public async Task AddLoyaltyPointAsync(LoyaltyPoint loyaltyPoint)
        {
            await _context.LoyaltyPoints.AddAsync(loyaltyPoint);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
