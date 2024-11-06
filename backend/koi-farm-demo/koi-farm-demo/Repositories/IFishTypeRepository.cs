using koi_farm_demo.Data;

namespace koi_farm_demo.Repositories
{
    public interface IFishTypeRepository
    {
        Task<IEnumerable<FishType>> GetAllAsync();
        Task<bool> AddAsync(FishType entity);
        Task<List<FishTypeDto>> GetTopSellingFishTypesAsync(int top);
    }
}
