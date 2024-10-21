public class ConsignmentLine
{
    public int ConsignmentLineId { get; set; }
    public int ConsignmentId { get; set; } 
    public string FishType { get; set; } 
    public int Quantity { get; set; }
    public string ImageUrl { get; set; }
    public string CertificationUrl { get; set; }
    public int TotalPrice { get; set; }

    public Consignment Consignment { get; set; }

}
