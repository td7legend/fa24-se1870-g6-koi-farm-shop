namespace koi_farm_demo.Repositories
{
    public interface ICertificateRepository
    {
        Task AddCertificateAsync(Certification certificate);
        Task<List<Certification>> GetCertificatesByFishIdAsync(int fishId);
    }
}
