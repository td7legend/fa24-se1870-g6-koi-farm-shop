namespace koi_farm_demo.Services
{
    public interface IRevenueService
    {
        Task<decimal> CalculateRevenueAsync(DateTime? startDate, DateTime? endDate);
    }
    public class RevenueService : IRevenueService
    {
        private readonly IOrderRepository _orderRepository;

        public RevenueService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<decimal> CalculateRevenueAsync(DateTime? startDate, DateTime? endDate)
        {
            // Lấy các đơn hàng đã hoàn thành trong khoảng thời gian chỉ định
            var orders = await _orderRepository.GetOrdersByStatusAndDateRangeAsync(OrderStatus.Completed, startDate, endDate);

            // Tính doanh thu tổng từ các đơn hàng
            decimal totalRevenue = orders.Sum(order => order.TotalAmount - order.TotalDiscount + order.TotalTax);

            return totalRevenue;
        }
    }
}
