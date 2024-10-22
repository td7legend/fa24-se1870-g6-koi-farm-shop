public class Consignment
{
    public int ConsignmentId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public decimal CareFee { get; set; }
    public decimal AgreedPrice { get; set; }
    public ConsignmentType Type { get; set; }
    public ConsignmentStatus Status { get; set; }
    public ICollection<ConsignmentLine> ConsignmentLines { get; set; }
    public decimal Price { get; set; }
    public string Note { get; set; }
    public int CustomerId { get; set; }
}

public enum ConsignmentType
{
    Care = 0,
    Sale = 1
}
public enum ConsignmentStatus
{
    Pending = 0,         
    UnderReview = 1,     
    Confirmed = 2,       
    ListedForSale = 3,   
    Sold = 4,            
    UnderCare = 5,       
    CareCompleted = 6    
}
