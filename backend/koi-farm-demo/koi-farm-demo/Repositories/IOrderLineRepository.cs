using koi_farm_demo.Data;

namespace koi_farm_demo.Repositories
{
    public interface IOrderLineRepository
    {
        Task AddAsync(OrderLine orderLine, OrderLineCreateDTO orderLineCreateDto);
        Task DeleteAsync(OrderLine orderLine);
    }
}
