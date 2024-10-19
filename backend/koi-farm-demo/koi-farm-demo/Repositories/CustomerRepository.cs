using koi_farm_demo.Data; // Namespace cho DbContext của bạn
using koi_farm_demo.Models; // Namespace cho model Customer
using Microsoft.EntityFrameworkCore; // Thêm dòng này
using System.Collections.Generic;
using System.Threading.Tasks;
    public interface ICustomerRepository
    {
    Task<Customer> GetByUserIdAsync(int userId);
    Task<Customer> GetCustomerByIdAsync(int customerId);
        Task<List<Customer>> GetAllCustomersAsync();
        Task AddCustomerAsync(Customer customer);
        Task UpdateCustomerAsync(Customer customer);
        Task DeleteCustomerAsync(int customerId);

    }

    public class CustomerRepository : ICustomerRepository
    {
        private readonly KoiFarmDbContext _context;

        public CustomerRepository(KoiFarmDbContext context)
        {
            _context = context;
        }
    public async Task<Customer> GetByUserIdAsync(int userId)
    {
        return await _context.Customers
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    public async Task<Customer> GetCustomerByIdAsync(int customerId)
        {
            return await _context.Customers.FindAsync(customerId);
        }

        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task AddCustomerAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCustomerAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCustomerAsync(int customerId)
        {
            var customer = await GetCustomerByIdAsync(customerId);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
            }
        }


    }

