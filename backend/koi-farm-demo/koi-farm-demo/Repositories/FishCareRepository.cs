using koi_farm_demo.Models;
using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class FishCareRepository : IFishCareRepository
    {
        private readonly KoiFarmDbContext _context;
        public FishCareRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task<FishCare> AddFishCareAsync(FishCare fishCare)
        {
            _context.FishCares.AddAsync(fishCare);
            await _context.SaveChangesAsync();
            return fishCare;
        }

        public async Task<IEnumerable<FishCare>> GetAllFishCareAsync()
        {
            return await _context.FishCares.ToListAsync();
        }

        public async Task<FishCare> GetFishCareByIdAsync(int fishCareId)
        {
            return await _context.FishCares.FindAsync(fishCareId);
        }

        public async Task<FishCare> UpdateFishCareAsync(FishCare fishCare)
        {
            var existingFishCare = await _context.FishCares.FindAsync(fishCare.FishCareId);
            if (existingFishCare == null)
            {
                return null; // Không tìm thấy FishCare để cập nhật
            }

            // Cập nhật các thuộc tính cần thiết
            existingFishCare.FishType = fishCare.FishType;
            existingFishCare.ConsignmentId = fishCare.ConsignmentId;
            existingFishCare.StandardHealthStatus = fishCare.StandardHealthStatus;
            existingFishCare.StandardCareDetails = fishCare.StandardCareDetails;

            await _context.SaveChangesAsync();
            return existingFishCare;
        }
        public async Task<FishCare> UpdateFishCareStatusAndDetailsAsync(int fishCareId, string healthStatus, string careDetails)
        {
            var fishCare = await _context.FishCares.FindAsync(fishCareId);
            if (fishCare == null)
            {
                return null; // Không tìm thấy FishCare với ID đã cho
            }

            // Cập nhật HealthStatus và CareDetails
            fishCare.StandardHealthStatus = healthStatus;
            fishCare.StandardCareDetails = careDetails;

            await _context.SaveChangesAsync();
            return fishCare;
        }
    }
    
}
