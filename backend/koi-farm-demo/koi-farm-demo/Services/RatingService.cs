using koi_farm_demo.Data;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IFishRepository _fishRepository;
        private readonly IOrderService _orderService;
        public RatingService(IRatingRepository ratingRepository, IFishRepository fishRepository, IOrderService orderService)
        {
            _ratingRepository = ratingRepository;
            _fishRepository = fishRepository;
            _orderService = orderService;
        }

        public async Task AddRatingAsync(int customerId, int fishId, int ratingValue, string comment)
        {
            if (!await _orderService.HasCustomerBoughtFishAsync(customerId, fishId))
            {
                throw new InvalidOperationException("Bạn không thể đánh giá cá mà bạn chưa mua.");
            }
       
            if (await _ratingRepository.HasCustomerRatedFishAsync(customerId, fishId))
            {
                throw new InvalidOperationException("Bạn đã đánh giá cá này rồi.");
            }

            var rating = new Rating
            {
                CustomerId = customerId,
                FishId = fishId,
                RatingValue = ratingValue,
                Comment = comment
            };

            await _ratingRepository.AddRatingAsync(rating);

            await UpdateFishOverallRating(fishId);
        }

        private async Task UpdateFishOverallRating(int fishId)
        {
            var ratings = await _ratingRepository.GetRatingsForFishAsync(fishId);
            if (ratings.Count > 0)
            {
                var overallRating = (decimal)ratings.Average(r => r.RatingValue);
                var fish = await _fishRepository.GetByIdAsync(fishId);
                fish.OverallRating = overallRating;

                await _fishRepository.UpdateFishAsync(fish);
            }
        }
        public async Task<List<RatingDto>> GetRatingsForFishAsync(int fishId)
        {
            var ratings = await _ratingRepository.GetRatingsForFishAsync(fishId);
            return ratings.Select(r => new RatingDto
            {
                RatingId = r.RatingId,
                CustomerName = r.Customer.FullName, 
                RatingValue = r.RatingValue,
                Comment = r.Comment
            }).ToList();
        }
    }
}
