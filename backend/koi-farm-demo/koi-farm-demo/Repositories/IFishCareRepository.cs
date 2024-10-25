using koi_farm_demo.Models;

namespace koi_farm_demo.Repositories
{
    public interface IFishCareRepository
    {
        Task<IEnumerable<FishCare>> GetAllFishCareAsync();
        Task<FishCare> AddFishCareAsync(FishCare fishCare);
        Task<FishCare> GetFishCareByIdAsync(int fishCareId);
        Task<FishCare> UpdateFishCareAsync(FishCare fishCare);
        Task<FishCare> UpdateFishCareStatusAndDetailsAsync(int fishCareId, string healthStatus, string careDetails);

    }
}
