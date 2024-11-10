using koi_farm_demo.Data;
using koi_farm_demo.Models;

public interface IFishService
{
    Task<IEnumerable<Fish>> GetAllFishAsync();
    Task<Fish> GetFishByIdAsync(int id);
    Task AddFishAsync(FishCreateDto fishCreateDto);
    Task UpdateFishAsync(Fish fish);
    Task DeleteFishAsync(int id);
    Task UpdateFishQuantityAsync(int id, int quantity);
    Task<IEnumerable<FishImage>> GetFishImagesByFishIdAsync(int fishId);
}