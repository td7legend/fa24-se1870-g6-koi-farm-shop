
using koi_farm_demo.Models;
using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public interface IFishImageRepository
    {
        Task AddFishImageAsync(FishImage fishImage);
        Task<IEnumerable<FishImage>> GetFishImagesByFishIdAsync(int fishId);
    }

    public class FishImageRepository : IFishImageRepository
    {
        private readonly KoiFarmDbContext _context;

        public FishImageRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task AddFishImageAsync(FishImage fishImage)
        {
            await _context.FishImages.AddAsync(fishImage);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<FishImage>> GetFishImagesByFishIdAsync(int fishId)
        {
            return await _context.FishImages
                .Where(f => f.FishId == fishId)
                .ToListAsync();
        }
    }
}


