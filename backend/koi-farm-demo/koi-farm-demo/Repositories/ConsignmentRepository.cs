using Google;
using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class ConsignmentRepository : IConsignmentRepository
    {
        private readonly KoiFarmDbContext _context;

        public ConsignmentRepository(KoiFarmDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Consignment>> GetConsignmentsByCustomerIdAsync(int customerId)
        {
            return await _context.Consignments
                .Where(c => c.CustomerId == customerId)
                .Include(c => c.ConsignmentLines) // Bao gồm các dòng ký gửi
                .ToListAsync();
        }
        public async Task<Consignment> GetByIdAsync(int id)
        {
            return await _context.Consignments.Include(c => c.ConsignmentLines).FirstOrDefaultAsync(c => c.ConsignmentId == id);
        }

        public async Task<IEnumerable<Consignment>> GetAllAsync()
        {
            return await _context.Consignments.ToListAsync();
        }

        public async Task AddAsync(Consignment consignment)
        {
            await _context.Consignments.AddAsync(consignment);
        }

        public async Task UpdateAsync(Consignment consignment)
        {
            _context.Consignments.Update(consignment);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<Consignment> GetByIdWithLinesAsync(int consignmentId)
        {
            return await _context.Consignments
                .Include(c => c.ConsignmentLines) // Bao gồm các dòng ký gửi
                .FirstOrDefaultAsync(c => c.ConsignmentId == consignmentId);
        }
        public async Task<IEnumerable<Consignment>> GetAllWithLinesAsync()
        {
            return await _context.Consignments
                .Include(c => c.ConsignmentLines) // Bao gồm các dòng ký gửi
                .ToListAsync();
        }
    }
}
