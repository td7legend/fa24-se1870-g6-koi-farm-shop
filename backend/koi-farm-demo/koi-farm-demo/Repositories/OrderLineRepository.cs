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
        // Kiểm tra xem orderLine đã tồn tại chưa
        var existingOrderLine = await _context.OrderLines
            .FirstOrDefaultAsync(ol => ol.OrderId == orderLine.OrderId && ol.FishId == orderLineCreateDto.FishId);

        if (existingOrderLine != null)
        {
            // Cập nhật các thuộc tính cần thiết
            existingOrderLine.Quantity += orderLineCreateDto.Quantity;
            // hoặc cập nhật các thuộc tính khác
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
}
