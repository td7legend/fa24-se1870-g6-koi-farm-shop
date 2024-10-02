using koi_farm_demo.Data;
using koi_farm_demo.Repositories;
using koi_farm_demo.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderLineRepository _orderLineRepository;
    private readonly IFishRepository _fishRepository;

    public OrderService(IOrderRepository orderRepository, IOrderLineRepository orderLineRepository, IFishRepository fishRepository)
    {
        _orderRepository = orderRepository;
        _orderLineRepository = orderLineRepository;
        _fishRepository = fishRepository;
    }
    public async Task<OrderDTO> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetOrderByIdAsync(id);

        if (order == null)
            return null; // Hoặc ném ra ngoại lệ nếu cần

        var orderDto = new OrderDTO
        {
            OrderId = order.OrderId,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            TotalTax = order.TotalTax,
            TotalDiscount = order.TotalDiscount,
            CustomerId = order.CustomerId,
            OrderLines = order.OrderLines.Select(ol => new OrderLineDTO
            {
                OrderId = ol.OrderId, // Chỉ bao gồm nếu cần
                FishId = ol.FishId,
                Quantity = ol.Quantity,
                UnitPrice = ol.UnitPrice,
                TotalPrice = ol.TotalPrice
            }).ToList()
        };

        return orderDto;
    }

    public async Task AddOrderLineAsync(int orderId, OrderLineCreateDTO orderLineCreateDto)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new Exception("Order not found");
        }

        var fish = await _fishRepository.GetByIdAsync(orderLineCreateDto.FishId);
        if (fish == null || fish.Quantity < orderLineCreateDto.Quantity)
        {
            throw new Exception("Fish not available or insufficient quantity");
        }

        // Tạo OrderLine mới
        var orderLine = new OrderLine
        {
            OrderId = orderId,
            FishId = orderLineCreateDto.FishId,
            Quantity = orderLineCreateDto.Quantity,
            UnitPrice = fish.Price,
            TotalPrice = fish.Price * orderLineCreateDto.Quantity
        };

        // Thêm OrderLine vào database
        await _orderLineRepository.AddAsync(orderLine, orderLineCreateDto);

        // Cập nhật TotalAmount của Order
        order.TotalAmount = order.OrderLines.Sum(ol => ol.TotalPrice);
        await _orderRepository.UpdateAsync(order);
    }


    public async Task RemoveOrderLineAsync(int orderId, int fishId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new Exception("Order not found");
        }

        var orderLine = order.OrderLines.FirstOrDefault(ol => ol.FishId == fishId);
        if (orderLine != null)
        {
            await _orderLineRepository.DeleteAsync(orderLine);

            // Cập nhật lại TotalAmount sau khi xóa OrderLine
            order.TotalAmount = order.OrderLines.Sum(ol => ol.TotalPrice);
            await _orderRepository.UpdateAsync(order);
        }
    }

    public async Task PayForOrderAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new Exception("Order not found");
        }

        // Cập nhật lại TotalAmount trước khi thanh toán
        order.TotalAmount = order.OrderLines.Sum(ol => ol.TotalPrice);
        order.Status = OrderStatus.Paid;

        await _orderRepository.UpdateAsync(order);

        // Cập nhật số lượng cá
        foreach (var orderLine in order.OrderLines)
        {
            var fish = await _fishRepository.GetByIdAsync(orderLine.FishId);
            fish.Quantity -= orderLine.Quantity;
            await _fishRepository.UpdateAsync(fish);
        }
    }
}
