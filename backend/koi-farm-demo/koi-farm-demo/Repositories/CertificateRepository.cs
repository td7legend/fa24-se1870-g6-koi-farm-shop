using Microsoft.EntityFrameworkCore;

namespace koi_farm_demo.Repositories
{
    public class CertificateRepository : ICertificateRepository
    {
        private readonly KoiFarmDbContext _context;
        public CertificateRepository(KoiFarmDbContext context)
        {
            _context = context;
        }
        public async Task AddCertificateAsync(Certification certificate)
        {
            _context.Certifications.Add(certificate);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Certification>> GetCertificatesByFishIdAsync(int fishId)
        {
            return await _context.Certifications
                .Where(c => c.FishId == fishId)
                .ToListAsync();
        }
    }
}
