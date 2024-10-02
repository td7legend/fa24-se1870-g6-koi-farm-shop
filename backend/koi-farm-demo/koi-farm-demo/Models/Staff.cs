public class Staff
{
    public int StaffId { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public ICollection<Consignment> Consignments { get; set; }
}
