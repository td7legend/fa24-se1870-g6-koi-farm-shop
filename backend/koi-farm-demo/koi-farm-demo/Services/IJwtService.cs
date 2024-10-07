namespace koi_farm_demo.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
