using koi_farm_demo.Data;

namespace koi_farm_demo.Services
{
    public interface ICertificateService
    {
        Task AddCertificateAsync(CertificateCreateDto certificateCreateDto);
        Task<List<CertificateDto>> GetCertificatesByFishIdAsync(int fishId);
    }
}
