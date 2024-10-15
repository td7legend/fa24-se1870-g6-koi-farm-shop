using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface IOrderService
    {
        Task<List<OrderHistoryDTO>> GetOrderHistory(int customerId);
        Task<List<OrderDTO>> GetOrdersInCartByCustomerIdAsync(int customerId);
        Task<OrderDTO> GetOrderByIdAsync(int orderId);
        Task AddOrderLineAsync(int orderId, OrderLineCreateDTO orderLineCreateDto);
        Task RemoveOrderLineAsync(int orderId, int fishId);
        Task PayForOrderAsync(int orderId);
        Task AddItemToCart(int customerId, OrderLineCreateDTO orderLineCreateDto);
        Task UpdateCartAsync(int customerId, UpdateCartDTO updateCartDTO);
    }
}
