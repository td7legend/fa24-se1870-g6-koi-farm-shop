using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface IOrderService
    {
        Task<OrderDTO> GetOrderByIdAsync(int orderId);
        Task AddOrderLineAsync(int orderId, OrderLineCreateDTO orderLineCreateDto);
        Task RemoveOrderLineAsync(int orderId, int fishId);
        Task PayForOrderAsync(int orderId);
    }
}
