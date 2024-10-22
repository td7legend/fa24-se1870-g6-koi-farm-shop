using koi_farm_demo.Models;

namespace koi_farm_demo.Services
    
{
    public interface IConsignmentService
    {
        Task UpdateCareFeeAndStatusAsync(int consignmentId, decimal newCareFee, ConsignmentStatus newStatus);
        Task<Consignment> CreateSaleConsignmentAsync(CreateConsignmentRequest request);
            Task<Consignment> CreateCareConsignmentAsync(CreateCareConsignmentRequest request);
            Task UpdateConsignmentStatusAsync(int consignmentId, ConsignmentStatus status);
            Task ReceiveConsignmentForSaleAsync(int consignmentId);
            Task ReceiveConsignmentForCareAsync(int consignmentId);
        Task UpdateAgreedPriceAndAddFishAsync(int consignmentId, long agreedPrice, List<FishDetails> fishDetails);
    }
}
