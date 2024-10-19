using koi_farm_demo.Data;
using Microsoft.EntityFrameworkCore;

public class OrderRepository : IOrderRepository
{
    private readonly KoiFarmDbContext _context;

    public OrderRepository(KoiFarmDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDTO> GetOrderByIdAsync(int orderId)
    {
        var order = await _context.Orders
        .Include(o => o.OrderLines)
        .ThenInclude(ol => ol.Fish)
        .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
        {
            throw new Exception("Order not found");
        }

        // Mapping Order to DTO
        var orderDto = new OrderDTO
        {
            OrderId = order.OrderId,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            OrderDate = order.OrderDate ?? DateTime.Now,
            TotalTax = order.TotalTax,
            TotalDiscount = order.TotalDiscount,
            Address = order.Address,
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
        };

        return orderDto;
    }

    public async Task<Order> GetByIdAsync(int orderId)
    {
        return await _context.Orders
            .Include(o => o.OrderLines)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);
    }

    public async Task AddOrderAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteOrderAsync(Order order)
    {
        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Order>> GetOrdersByCustomerIdAsync(int customerId)
    {
        return await _context.Orders
            .Include(o => o.OrderLines)
            .ThenInclude(ol => ol.Fish)
            .Where(o => o.CustomerId == customerId)
            .ToListAsync();
    }
    public async Task<Order> GetInCartOrderByCustomerIdAsync(int customerId)
    {
        return await _context.Orders
            .Include(o => o.OrderLines)
            .FirstOrDefaultAsync(o => o.CustomerId == customerId && o.Status == OrderStatus.InCart);
    }
    public async Task<List<Order>> GetOrderHistoryByCustomerIdAsync(int customerId)
    {
        return await _context.Orders
            .Include(o => o.OrderLines)
            .ThenInclude(ol => ol.Fish)
            .Where(o => o.CustomerId == customerId && o.Status != OrderStatus.InCart)
            .ToListAsync();
    }
}
