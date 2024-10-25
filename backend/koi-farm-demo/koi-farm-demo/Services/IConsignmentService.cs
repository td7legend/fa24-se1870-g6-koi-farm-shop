using koi_farm_demo.Data;
using koi_farm_demo.Models;

namespace koi_farm_demo.Services
    
{
    public interface IConsignmentService
    {
        Task UpdateConsignmentForSaleAsync(int consignmentId, decimal agreePrice, List<ConsignmentLineUpdateDto> updatedConsignmentLines);
        Task ReceiveConsignmentForSaleAsync(int consignmentId, decimal agreePrice);
        Task ReceiveConsignmentForCareAsync(int consignmentId, decimal careFee);
        Task<IEnumerable<Consignment>> GetConsignmentsByCustomerIdAsync(int customerId);
        Task UpdateCareFeeAndStatusAsync(int consignmentId, decimal newCareFee, ConsignmentStatus newStatus);
        Task<Consignment> CreateSaleConsignmentAsync(CreateConsignmentRequest request);
        Task<Consignment> CreateCareConsignmentAsync(CreateCareConsignmentRequest request);
        Task UpdateConsignmentStatusAsync(int consignmentId, ConsignmentStatus status);
        Task UpdateAgreedPriceAndAddFishAsync(int consignmentId, long agreedPrice, List<FishDetails> fishDetails);
        Task<IEnumerable<Consignment>> GetAllConsignmentAsync();
    }
}
