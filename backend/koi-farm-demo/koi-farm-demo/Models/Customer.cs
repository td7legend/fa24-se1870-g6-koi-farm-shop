public class Customer
{
    public int CustomerId { get; set; }
    public string FullName { get; set; }
    public string Address { get; set; }
    public string? PhoneNumber { get; set; }
    public CustomerTier Tier { get; set; }
    public int PointAvailable { get; set; }
    public int UsedPoint { get; set; }
    public int AccommodatePoint { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<Rating> Ratings { get; set; }
    public User User { get; set; }
    public int UserId { get; set; }
}

public enum CustomerTier
{
    Basic = 0,
    Silver = 1,
    Gold = 2,
    Platinum = 3
}
