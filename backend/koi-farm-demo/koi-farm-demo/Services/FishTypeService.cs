using koi_farm_demo.Data;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public class FishTypeService : IFishTypeService
    {
        private readonly IFishTypeRepository _fishTypeRepository;

        public FishTypeService(IFishTypeRepository fishTypeRepository)
        {
            _fishTypeRepository = fishTypeRepository;
        }

        public async Task<bool> AddFishTypeAsync(FishTypeCreateDto fishTypeCreateDto)
        {
            var fishType = new FishType
            {
                Name = fishTypeCreateDto.Name,
                Description = fishTypeCreateDto.Description
            };

            return await _fishTypeRepository.AddAsync(fishType);
        }
    }
}
