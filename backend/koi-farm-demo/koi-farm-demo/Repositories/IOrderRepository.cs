using koi_farm_demo.Data;

public interface IOrderRepository
{
    Task<List<Order>> GetAllOrdersWithStatusAsync();
    Task<List<Order>> GetOrdersByCustomerIdAsync(int customerId);
    Task<OrderDTO> GetOrderByIdAsync(int orderId); 
    Task<Order> GetByIdAsync(int orderId); 
    Task AddOrderAsync(Order order); 
    Task UpdateAsync(Order order); 
    Task DeleteOrderAsync(Order order);
    Task<Order> GetInCartOrderByCustomerIdAsync(int customerId);
    Task<List<Order>> GetOrderHistoryByCustomerIdAsync(int customerId);
    Task<IEnumerable<Order>> GetOrdersByStatusAndDateRangeAsync(OrderStatus status, DateTime? startDate, DateTime? endDate);
}
