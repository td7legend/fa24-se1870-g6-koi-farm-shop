public class ConsignmentLine
{
    public int ConsignmentLineId { get; set; }
    public int ConsignmentId { get; set; } 
    public int FishId { get; set; } 
    public int Quantity { get; set; }
    public int UnitPrice { get; set; }
    public int TotalPrice { get; set; }

    public Consignment Consignment { get; set; }
    public Fish Fish { get; set; }
}
