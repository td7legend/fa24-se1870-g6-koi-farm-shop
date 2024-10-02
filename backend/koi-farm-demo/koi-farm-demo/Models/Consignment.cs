public class Consignment
{
    public int ConsignmentId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Amount { get; set; }
    public ConsignmentType Type { get; set; }
    public ConsignmentStatus Status { get; set; }
    public ICollection<ConsignmentLine> ConsignmentLines { get; set; }
    public int StaffId { get; set; }
    public Staff Staff { get; set; }
    public decimal Price { get; set; }
}

public enum ConsignmentType
{
    Breed = 0,
    Sale = 1
}
public enum ConsignmentStatus
{
    Pending = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3
}
