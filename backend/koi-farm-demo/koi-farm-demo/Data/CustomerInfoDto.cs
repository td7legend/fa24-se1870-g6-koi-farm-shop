namespace koi_farm_demo.Data
{
    public class CustomerInfoDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string? PhoneNumber { get; set; }
        public CustomerTier Tier { get; set; }
        public int PointAvailable { get; set; }
        public int UsedPoint { get; set; }
        public int AccommodatePoint { get; set; }
        public string Email { get; set; } 
    }
}
