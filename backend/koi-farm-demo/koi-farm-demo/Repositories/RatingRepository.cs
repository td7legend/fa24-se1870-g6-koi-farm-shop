using System;
using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class RatingRepository : IRatingRepository
    {
        private readonly KoiFarmDbContext _context;

        public RatingRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasCustomerRatedFishAsync(int customerId, int fishId)
        {
            return await _context.Ratings.AnyAsync(r => r.CustomerId == customerId && r.FishId == fishId);
        }

        public async Task<Rating> AddRatingAsync(Rating rating)
        {
            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();
            return rating;
        }

        public async Task<List<Rating>> GetRatingsForFishAsync(int fishId)
        {
            return await _context.Ratings
           .Include(r => r.Customer)  
           .Where(r => r.FishId == fishId)
           .ToListAsync();

        }
    }
}
