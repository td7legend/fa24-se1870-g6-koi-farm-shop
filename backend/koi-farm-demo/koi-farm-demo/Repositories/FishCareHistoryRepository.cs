using koi_farm_demo.Models;
using Microsoft.EntityFrameworkCore;

public interface IFishCareHistoryRepository
{
    Task<FishCareHistory> AddFishCareHistoryAsync(FishCareHistory fishCareHistory);
    Task<IEnumerable<FishCareHistory>> GetFishCareHistoryByFishIdAsync(int fishId);
}

public class FishCareHistoryRepository : IFishCareHistoryRepository
{
    private readonly KoiFarmDbContext _context;

    public FishCareHistoryRepository(KoiFarmDbContext context)
    {
        _context = context;
    }

    public async Task<FishCareHistory> AddFishCareHistoryAsync(FishCareHistory fishCareHistory)
    {
        _context.FishCareHistories.Add(fishCareHistory);
        await _context.SaveChangesAsync();
        return fishCareHistory;
    }

    public async Task<IEnumerable<FishCareHistory>> GetFishCareHistoryByFishIdAsync(int fishId)
    {
        return await _context.FishCareHistories
            .Where(fc => fc.FishCareId == fishId)
            .OrderByDescending(fc => fc.CareDate)  
            .ToListAsync();
    }
}

