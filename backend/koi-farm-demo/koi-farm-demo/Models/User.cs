public class User
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string HashPassword { get; set; }
    public UserRole Role { get; set; }
    public string? GoogleId { get; set; }
}

public enum UserRole
{
    Customer = 0,
    Staff = 1,
    Manager = 2
}
