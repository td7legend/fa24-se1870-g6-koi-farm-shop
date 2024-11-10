using koi_farm_demo.Data;
using koi_farm_demo.Models;

public interface IFishCareHistoryService
{
    Task<FishCareHistory> AddFishCareHistoryAsync(int fishId, FishCareDto fishCareDto);
    Task<IEnumerable<FishCareHistory>> GetFishCareHistoryByFishIdAsync(int fishId);
}

public class FishCareHistoryService : IFishCareHistoryService
{
    private readonly IFishCareHistoryRepository _fishCareHistoryRepository;

    public FishCareHistoryService(IFishCareHistoryRepository fishCareHistoryRepository)
    {
        _fishCareHistoryRepository = fishCareHistoryRepository;
    }

    public async Task<FishCareHistory> AddFishCareHistoryAsync(int fishCareId, FishCareDto fishCareDto)
    {
        // Tạo đối tượng FishCareHistory
        var fishCareHistory = new FishCareHistory
        {
            FishCareId = fishCareId,
            HealthStatus = fishCareDto.HealthStatus,
            CareDetails = fishCareDto.CareDetails,
            CareDate = DateTime.UtcNow
        };

        // Thêm vào lịch sử
        return await _fishCareHistoryRepository.AddFishCareHistoryAsync(fishCareHistory);
    }

    public async Task<IEnumerable<FishCareHistory>> GetFishCareHistoryByFishIdAsync(int fishId)
    {
        return await _fishCareHistoryRepository.GetFishCareHistoryByFishIdAsync(fishId);
    }
}
