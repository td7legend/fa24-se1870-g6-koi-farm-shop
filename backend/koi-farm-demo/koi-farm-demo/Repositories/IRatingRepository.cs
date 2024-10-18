namespace koi_farm_demo.Repositories
{
    public interface IRatingRepository
    {
        Task<bool> HasCustomerRatedFishAsync(int customerId, int fishId);
        Task<Rating> AddRatingAsync(Rating rating);
        Task<List<Rating>> GetRatingsForFishAsync(int fishId);
    }
}
