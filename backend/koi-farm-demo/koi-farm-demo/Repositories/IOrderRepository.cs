public interface IOrderRepository
{
    Task<Order> GetOrderByIdAsync(int id); // Giữ nguyên
    Task<Order> GetByIdAsync(int orderId); // Thêm phương thức này nếu bạn cần
    Task AddOrderAsync(Order order); // Giữ nguyên
    Task UpdateAsync(Order order); // Thêm phương thức này nếu bạn cần
    Task DeleteOrderAsync(Order order); // Giữ nguyên
}
