namespace koi_farm_demo.Repositories
{
    public interface IFishTypeRepository
    {
        Task<bool> AddAsync(FishType entity);
    }
}
