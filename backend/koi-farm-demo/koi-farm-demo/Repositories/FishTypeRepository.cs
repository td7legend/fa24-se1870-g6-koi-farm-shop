using koi_farm_demo.Data;
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
        public async Task<List<FishTypeDto>> GetTopSellingFishTypesAsync(int top)
        {
            return await _context.OrderLines
                .Include(ol => ol.Fish)
                .ThenInclude(f => f.FishType)
                .GroupBy(ol => ol.Fish.FishType)
                .Select(g => new FishTypeDto
                {
                    FishTypeId = g.Key.FishTypeId,
                    FishTypeName = g.Key.Name,
                    TotalSold = g.Sum(ol => ol.Quantity)
                })
                .OrderByDescending(ft => ft.TotalSold)
                .Take(top)
                .ToListAsync();
        }
    }
}
