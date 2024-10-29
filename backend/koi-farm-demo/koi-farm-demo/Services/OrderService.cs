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
            return null; 

        var orderDto = new OrderDTO
        {
            OrderId = order.OrderId,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            TotalTax = order.TotalTax,
            TotalDiscount = order.TotalDiscount,
            Address = order.Address,
            OrderDate = order.OrderDate,
            CustomerId = order.CustomerId,
            OrderLines = order.OrderLines.Select(ol => new OrderLineDTO
            {
                FishId = ol.FishId,
                FishName = ol.FishName,
                ImageUrl = ol.ImageUrl,
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

        
        var orderLine = new OrderLine
        {
            OrderId = orderId,
            FishId = orderLineCreateDto.FishId,
            Quantity = orderLineCreateDto.Quantity,
            UnitPrice = fish.Price,
            TotalPrice = fish.Price * orderLineCreateDto.Quantity
        };

        await _orderLineRepository.AddAsync(orderLine, orderLineCreateDto);

       
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

            order.TotalAmount = order.OrderLines.Sum(ol => ol.TotalPrice);
            await _orderRepository.UpdateAsync(order);
        }
    }

    public async Task PayForOrderAsync(int orderId, OrderDTO orderDto)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new Exception("Order not found");
        }

        // Cập nhật các thuộc tính từ OrderDTO vào Order
        order.TotalAmount = orderDto.TotalAmount;
        order.TotalTax = orderDto.TotalTax;
        order.TotalDiscount = orderDto.TotalDiscount;
        order.Status = OrderStatus.Paid;  // Cập nhật trạng thái đơn hàng thành Paid
        order.OrderDate = orderDto.OrderDate;
        order.Address = orderDto.Address;

        // Cập nhật từng OrderLine từ DTO
        foreach (var orderLineDto in orderDto.OrderLines)
        {
            var orderLine = order.OrderLines.FirstOrDefault(ol => ol.FishId == orderLineDto.FishId);
            if (orderLine != null)
            {
                orderLine.Quantity = orderLineDto.Quantity;
                orderLine.UnitPrice = orderLineDto.UnitPrice;
                orderLine.TotalPrice = orderLineDto.TotalPrice;
            }
        }

        await _orderRepository.UpdateAsync(order);

        // Trừ số lượng cá từ kho
        foreach (var orderLine in order.OrderLines)
        {
            var fish = await _fishRepository.GetByIdAsync(orderLine.FishId);
            if (fish != null)
            {
                fish.Quantity -= orderLine.Quantity;
                await _fishRepository.UpdateAsync(fish);
            }
        }
    }

    public async Task<List<OrderDTO>> GetOrdersInCartByCustomerIdAsync(int customerId)
    {
        var orders = await _orderRepository.GetOrdersByCustomerIdAsync(customerId);

        var orderDtos = orders
            .Where(o => o.Status == OrderStatus.InCart) 
            .Select(order => new OrderDTO
            {
                OrderId = order.OrderId,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                TotalTax = order.TotalTax,
                TotalDiscount = order.TotalDiscount,
                CustomerId = order.CustomerId,
                OrderLines = order.OrderLines.Select(ol => new OrderLineDTO
                {
                    FishId = ol.FishId,
                    Quantity = ol.Quantity,
                    UnitPrice = ol.UnitPrice,
                    TotalPrice = ol.TotalPrice,
                    FishName = ol.Fish.Name, 
                    ImageUrl = ol.Fish.ImageUrl 
                }).ToList()
            }).ToList();

        return orderDtos;
    }
    public async Task AddItemToCart(int customerId, OrderLineCreateDTO orderLineCreateDto)
    {
        var inCartOrder = await _orderRepository.GetInCartOrderByCustomerIdAsync(customerId);

        if (inCartOrder == null)
        {
            var newOrder = new Order
            {
                CustomerId = customerId,
                Status = OrderStatus.InCart,
                TotalAmount = 0,
                TotalTax = 0,
                TotalDiscount = 0,
                OrderLines = new List<OrderLine>()
            };

            await _orderRepository.AddOrderAsync(newOrder);
            inCartOrder = newOrder;
        }

        var fish = await _fishRepository.GetByIdAsync(orderLineCreateDto.FishId);
        if (fish == null)
        {
            throw new Exception("Fish not available");
        }
        if (fish.Quantity < orderLineCreateDto.Quantity)
        {
            throw new Exception("Insufficient quantity");
        }

        var orderLine = new OrderLine
        {
            OrderId = inCartOrder.OrderId,
            FishId = orderLineCreateDto.FishId,
            Quantity = orderLineCreateDto.Quantity,
            UnitPrice = fish.Price,
            TotalPrice = fish.Price * orderLineCreateDto.Quantity
        };

        await _orderLineRepository.AddAsync(orderLine, orderLineCreateDto);

        inCartOrder.TotalAmount = inCartOrder.OrderLines.Sum(ol => ol.TotalPrice);
        await _orderRepository.UpdateAsync(inCartOrder);
    }

    public async Task<List<OrderHistoryDTO>> GetOrderHistory(int customerId)
    {
        var orders = await _orderRepository.GetOrderHistoryByCustomerIdAsync(customerId);

        return orders.Select(order => new OrderHistoryDTO
        {
            OrderId = order.OrderId,
            OrderDate = order.OrderDate ?? DateTime.MinValue,
            TotalAmount = order.TotalAmount,
            Status = order.Status.ToString()  
        }).ToList();
    }

    public async Task UpdateCartAsync(int customerId,UpdateCartDTO updateCartDTO)
    {
        var orders = await _orderRepository.GetInCartOrderByCustomerIdAsync(customerId);
        if(orders == null)
        {
            throw new Exception("Cart not found");
        }
        if (updateCartDTO.IsRemove == true)
        {
            await _orderLineRepository.DeleteAsync(await _orderLineRepository.GetOrderLineByFishId( updateCartDTO.FishId, orders.OrderId));
        }
        else
        {
            await _orderLineRepository.UpdateAsync(updateCartDTO, orders.OrderId);
        }

    }
    public async Task<bool> HasCustomerBoughtFishAsync(int customerId, int fishId)
    {
        var orders = await _orderRepository.GetOrderHistoryByCustomerIdAsync(customerId);
        return orders.Any(order => order.OrderLines.Any(ol => ol.FishId == fishId));
    }
    public async Task UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
        {
            throw new Exception("Order not found");
        }

        order.Status = status;
        await _orderRepository.UpdateAsync(order);
    }
    public async Task<List<OrderDTO>> GetAllOrdersWithStatusAsync()
    {
        var orders = await _orderRepository.GetAllOrdersWithStatusAsync();

        return orders.Select(order => new OrderDTO
        {
            OrderId = order.OrderId,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            OrderDate = order.OrderDate ?? DateTime.Now,
            TotalTax = order.TotalTax,
            TotalDiscount = order.TotalDiscount,
            CustomerId = order.CustomerId,
            OrderLines = order.OrderLines.Select(ol => new OrderLineDTO
            {
                FishId = ol.FishId,
                FishName = ol.Fish.Name,
                ImageUrl = ol.Fish.ImageUrl,
                Quantity = ol.Quantity,
                UnitPrice = ol.UnitPrice,
                TotalPrice = ol.TotalPrice
            }).ToList()
        }).ToList();
    }

}
