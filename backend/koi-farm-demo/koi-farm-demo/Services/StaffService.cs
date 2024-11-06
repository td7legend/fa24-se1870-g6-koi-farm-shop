using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public interface IStaffService
    {
        Task AddStaffAsync(Staff staff);
        Task<IEnumerable<Staff>> GetAllStaffAsync();
    }
    public class StaffService : IStaffService
    {
        private readonly IStaffRepository _staffRepository;
        public StaffService(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }
        public async Task AddStaffAsync(Staff staff)
        {
            await _staffRepository.AddStaffAsync(staff);
        }
        public async Task<IEnumerable<Staff>> GetAllStaffAsync()
        {
            return await _staffRepository.GetAllStaffAsync();
        }
    }
}
