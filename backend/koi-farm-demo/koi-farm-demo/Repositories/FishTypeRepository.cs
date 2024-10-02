namespace koi_farm_demo.Repositories
{
    public class FishTypeRepository : IFishTypeRepository
    {
        private readonly KoiFarmDbContext _context;

        public FishTypeRepository(KoiFarmDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddAsync(FishType entity)
        {
            await _context.FishTypes.AddAsync(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
