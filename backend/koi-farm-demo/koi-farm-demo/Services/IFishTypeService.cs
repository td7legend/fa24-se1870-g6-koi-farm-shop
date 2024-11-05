using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface IFishTypeService
    {
        Task<IEnumerable<FishType>> GetAllFishTypesAsync();
        Task<bool> AddFishTypeAsync(FishTypeCreateDto fishTypeCreateDto);
        Task<List<FishTypeDto>> GetTopSellingFishTypesAsync(int top = 8);
    }
}
