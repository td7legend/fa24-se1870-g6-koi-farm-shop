using koi_farm_demo.Data;
using static NuGet.Packaging.PackagingConstants;

namespace koi_farm_demo.Repositories
{
    public interface IOrderLineRepository
    {
        Task AddAsync(OrderLine orderLine, OrderLineCreateDTO orderLineCreateDto);
        Task DeleteAsync(OrderLine orderLine);
        Task UpdateAsync(UpdateCartDTO orderLineUpdateData, int orderId);
        Task<OrderLine> GetOrderLineByFishId(int fishId, int orderId);

    }
}
