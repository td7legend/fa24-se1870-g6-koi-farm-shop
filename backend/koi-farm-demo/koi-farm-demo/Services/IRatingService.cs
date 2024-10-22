using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface IRatingService
    {
        Task AddRatingAsync(int customerId, int fishId, int ratingValue, string comment);
        Task<List<RatingDto>> GetRatingsForFishAsync(int fishId);
    }
}
