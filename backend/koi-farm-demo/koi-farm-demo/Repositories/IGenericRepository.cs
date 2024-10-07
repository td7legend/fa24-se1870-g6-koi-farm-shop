namespace koi_farm_demo.Repositories
{
    // IGenericRepository.cs
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }

    
    public interface IFishRepository : IGenericRepository<Fish>
    {
        // Bạn có thể thêm các phương thức riêng cho Fish nếu cần
        Task UpdateQuantityAsync(int id, int quantity);
        Task<Fish> GetByIdAsync(int id);
        Task UpdateFishAsync(Fish fish);
    }
}

