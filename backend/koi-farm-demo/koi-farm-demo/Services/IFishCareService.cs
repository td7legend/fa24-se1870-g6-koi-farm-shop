using koi_farm_demo.Models;

namespace koi_farm_demo.Services
{
    public interface IFishCareService
    {
        Task<FishCare> UpdateFishCareStatusAndDetailsAsync(int fishCareId, string healthStatus, string careDetails);
        Task<FishCare> AddFishCareAsync(FishCare fishCare);
        Task<IEnumerable<FishCare>> GetAllFishCareAsync();
        Task<FishCare> GetFishCareByIdAsync(int fishCareId);
        Task<FishCare> UpdateFishCareAsync(FishCare fishCare);
    }
}
