using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public interface ILoyaltyPointService
    {
        Task AwardPointsAsync(int customerId, decimal orderAmount);
        Task<bool> RedeemPointsAsync(int customerId, int pointsToRedeem);
    }

    public class LoyaltyPointService : ILoyaltyPointService
    {
        private readonly ILoyaltyPointRepository _loyaltyPointRepository;

        public LoyaltyPointService(ILoyaltyPointRepository loyaltyPointRepository)
        {
            _loyaltyPointRepository = loyaltyPointRepository;
        }

        public async Task AwardPointsAsync(int customerId, decimal orderAmount)
        {
            var customer = await _loyaltyPointRepository.GetCustomerByIdAsync(customerId);
            if (customer == null) throw new Exception("Customer not found");

            int pointsToAward = CalculatePoints(customer.Tier, orderAmount);
            customer.PointAvailable += pointsToAward;
            customer.AccommodatePoint += pointsToAward;

            await CheckAndUpdateTierAsync(customer);

            var loyaltyPoint = new LoyaltyPoint
            {
                CustomerId = customerId,
                Amount = pointsToAward,
                AwardedDate = DateTime.Now
            };

            await _loyaltyPointRepository.AddLoyaltyPointAsync(loyaltyPoint);
            await _loyaltyPointRepository.SaveChangesAsync();
        }

        private int CalculatePoints(CustomerTier tier, decimal orderAmount)
        {
            int pointsPer100k = tier switch
            {
                CustomerTier.Basic => 1,
                CustomerTier.Silver => 2,
                CustomerTier.Gold => 3,
                CustomerTier.Platinum => 5,
                _ => 1
            };

            return (int)(orderAmount / 100000) * pointsPer100k;
        }

        private async Task CheckAndUpdateTierAsync(Customer customer)
        {
            if (customer.AccommodatePoint >= 500)
                customer.Tier = CustomerTier.Platinum;
            else if (customer.AccommodatePoint >= 200)
                customer.Tier = CustomerTier.Gold;
            else if (customer.AccommodatePoint >= 100)
                customer.Tier = CustomerTier.Silver;
            else
                customer.Tier = CustomerTier.Basic;

            await _loyaltyPointRepository.SaveChangesAsync();
        }

        public async Task<bool> RedeemPointsAsync(int customerId, int pointsToRedeem)
        {
            var customer = await _loyaltyPointRepository.GetCustomerByIdAsync(customerId);
            if (customer == null) throw new Exception("Customer not found");

            if (customer.PointAvailable < pointsToRedeem)
                return false;

            customer.PointAvailable -= pointsToRedeem;
            customer.UsedPoint += pointsToRedeem;
            await _loyaltyPointRepository.SaveChangesAsync();

            return true;
        }
    }

}
