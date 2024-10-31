using koi_farm_demo.Models;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public class FishCareService : IFishCareService
    {
        private readonly IFishCareRepository _fishCareRepository;

        public FishCareService(IFishCareRepository fishCareRepository)
        {
            _fishCareRepository = fishCareRepository;
        }

        public async Task<FishCare> AddFishCareAsync(FishCare fishCare)
        {
            return await _fishCareRepository.AddFishCareAsync(fishCare);
        }
        public async Task<IEnumerable<FishCare>> GetAllFishCareAsync()
        {
            return await _fishCareRepository.GetAllFishCareAsync();
        }

        // Lấy FishCare theo ID
        public async Task<FishCare> GetFishCareByIdAsync(int fishCareId)
        {
            return await _fishCareRepository.GetFishCareByIdAsync(fishCareId);
        }

        // Cập nhật FishCare
        public async Task<FishCare> UpdateFishCareAsync(FishCare fishCare)
        {
            return await _fishCareRepository.UpdateFishCareAsync(fishCare);
        }
        public async Task<FishCare> UpdateFishCareStatusAndDetailsAsync(int fishCareId, string healthStatus, string careDetails)
        {
            return await _fishCareRepository.UpdateFishCareStatusAndDetailsAsync(fishCareId, healthStatus, careDetails);
        }

    }
}
