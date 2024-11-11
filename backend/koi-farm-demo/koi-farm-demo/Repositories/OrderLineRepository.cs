using koi_farm_demo.Data;
using koi_farm_demo.Repositories;
using Microsoft.EntityFrameworkCore;

public class OrderLineRepository : IOrderLineRepository
{
    private readonly KoiFarmDbContext _context;

    public OrderLineRepository(KoiFarmDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(OrderLine orderLine, OrderLineCreateDTO orderLineCreateDto)
    {
        var existingOrderLine = await _context.OrderLines
            .FirstOrDefaultAsync(ol => ol.OrderId == orderLine.OrderId && ol.FishId == orderLineCreateDto.FishId);

        if (existingOrderLine != null)
        {
            
            existingOrderLine.Quantity += orderLineCreateDto.Quantity;
            
            existingOrderLine.TotalPrice += orderLineCreateDto.Quantity * existingOrderLine.UnitPrice;
            _context.OrderLines.Update(existingOrderLine);
        }
        else
        {
            var newOrderLine = new OrderLine
            {
                OrderId = orderLine.OrderId,
                FishId = orderLineCreateDto.FishId,
                Quantity = orderLineCreateDto.Quantity
            };

            await _context.OrderLines.AddAsync(newOrderLine);
        }

        await _context.SaveChangesAsync();
    }


    public async Task DeleteAsync(OrderLine orderLine)
    {
        _context.OrderLines.Remove(orderLine);
        await _context.SaveChangesAsync();
    }
    public async Task<OrderLine> GetOrderLineByFishId(int fishId,int orderId)
    {
        return await _context.OrderLines.SingleOrDefaultAsync(OrderLine => OrderLine.FishId == fishId && OrderLine.OrderId == orderId);
    }

    public async Task UpdateAsync(UpdateCartDTO orderLineUpdateData, int orderId)
    {
        // Lấy dòng sản phẩm từ order line dựa trên fishId và orderId
        var orderLine = await GetOrderLineByFishId(orderLineUpdateData.FishId, orderId);
        if (orderLine == null)
        {
            throw new Exception("Order line not found.");
        }
        if (orderLineUpdateData.IsAdd)
        {
            orderLine.Quantity += 1;  
        }
        else
        {
            if (orderLine.Quantity > 1)
            {
                orderLine.Quantity -= 1;  
            }
            else
            {
                _context.OrderLines.Remove(orderLine);
            }
        }
        if (_context.Entry(orderLine).State != EntityState.Deleted)
        {
            _context.OrderLines.Update(orderLine);
        }
        await _context.SaveChangesAsync();
    }
    public async Task AddAsync(OrderLine orderLine)
    {
        await _context.OrderLines.AddAsync(orderLine);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(OrderLine orderLine)
    {
        _context.OrderLines.Update(orderLine);
        await _context.SaveChangesAsync();
    }
}
