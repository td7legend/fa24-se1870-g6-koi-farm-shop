using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class FishRepository : IFishRepository
    {
        private readonly KoiFarmDbContext _context;

        public FishRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Fish>> GetAllAsync()
        {
            return await _context.Fish.ToListAsync();
        }

        public async Task<Fish> GetByIdAsync(int id)
        {
            return await _context.Fish.FindAsync(id);
        }

        public async Task AddAsync(Fish entity)
        {
            await _context.Fish.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Fish entity)
        {
            _context.Fish.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var fish = await _context.Fish.FindAsync(id);
            if (fish != null)
            {
                _context.Fish.Remove(fish);
                await _context.SaveChangesAsync();
            }
        }
        public async Task UpdateQuantityAsync(int id, int quantity)
        {
            var fish = await _context.Fish.FindAsync(id);
            if (fish != null)
            {
                fish.Quantity = quantity;
                await _context.SaveChangesAsync();
            }
        }
        public async Task UpdateFishAsync(Fish fish)
        {
            _context.Fish.Update(fish);
            await _context.SaveChangesAsync();
        }

    }
}
