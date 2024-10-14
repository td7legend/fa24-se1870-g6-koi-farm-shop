public interface IOrderRepository
{
    Task<List<Order>> GetOrdersByCustomerIdAsync(int customerId);
    Task<Order> GetOrderByIdAsync(int id); 
    Task<Order> GetByIdAsync(int orderId); 
    Task AddOrderAsync(Order order); 
    Task UpdateAsync(Order order); 
    Task DeleteOrderAsync(Order order);
    Task<Order> GetInCartOrderByCustomerIdAsync(int customerId);
    Task<List<Order>> GetOrderHistoryByCustomerIdAsync(int customerId);
}
