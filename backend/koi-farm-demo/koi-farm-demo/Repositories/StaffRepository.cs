namespace koi_farm_demo.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly KoiFarmDbContext _context;

        public StaffRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task AddStaffAsync(Staff staff)
        {
            await _context.Staffs.AddAsync(staff);
            await _context.SaveChangesAsync();
        }
    }
    public interface IStaffRepository
    {
        Task AddStaffAsync(Staff staff);
    }


}
