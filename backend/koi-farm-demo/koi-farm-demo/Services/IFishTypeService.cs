using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface IFishTypeService
    {
        Task<bool> AddFishTypeAsync(FishTypeCreateDto fishTypeCreateDto);
    }
}
