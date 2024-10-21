namespace koi_farm_demo.Repositories
{
    public interface IConsignmentRepository
    {
            Task<Consignment> GetByIdAsync(int id);
            Task<IEnumerable<Consignment>> GetAllAsync();
            Task AddAsync(Consignment consignment);
            Task UpdateAsync(Consignment consignment);
            Task SaveChangesAsync();
        Task<Consignment> GetByIdWithLinesAsync(int consignmentId);
        Task<IEnumerable<Consignment>> GetAllWithLinesAsync();
    }
}
