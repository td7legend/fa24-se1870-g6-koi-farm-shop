using koi_farm_demo.Data;
using koi_farm_demo.Repositories;

namespace koi_farm_demo.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly ICertificateRepository _certificateRepository;

        public CertificateService(ICertificateRepository certificateRepository)
        {
            _certificateRepository = certificateRepository;
        }

        public async Task AddCertificateAsync(CertificateCreateDto certificateCreateDto)
        {
            var certificate = new Certification
            {
                //FishId = certificateCreateDto.FishId,
                Description = certificateCreateDto.Description,
                IssueDate = certificateCreateDto.IssueDate,
                Url = certificateCreateDto.Url
            };

            await _certificateRepository.AddCertificateAsync(certificate);
        }

        public async Task<List<CertificateDto>> GetCertificatesByFishIdAsync(int fishId)
        {
            var certifications = await _certificateRepository.GetCertificatesByFishIdAsync(fishId);

            return certifications.Select(c => new CertificateDto
            {
                CertificationId = c.CertificationId,
                Description = c.Description,
                IssueDate = c.IssueDate,
                Url = c.Url
            }).ToList();
        }
    }
}
