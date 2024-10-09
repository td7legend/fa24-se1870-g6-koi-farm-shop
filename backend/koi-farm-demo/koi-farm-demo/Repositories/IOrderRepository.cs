public interface IOrderRepository
{
    Task<Order> GetOrderByIdAsync(int id); 
    Task<Order> GetByIdAsync(int orderId); 
    Task AddOrderAsync(Order order); 
    Task UpdateAsync(Order order); 
    Task DeleteOrderAsync(Order order); 
}
