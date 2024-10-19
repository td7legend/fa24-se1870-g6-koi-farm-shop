using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class FishTypeRepository : IFishTypeRepository
    {
        private readonly KoiFarmDbContext _context;

        public FishTypeRepository(KoiFarmDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<FishType>> GetAllAsync()
        {
            return await _context.FishTypes.ToListAsync();
        }
        public async Task<bool> AddAsync(FishType entity)
        {
            await _context.FishTypes.AddAsync(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
