using System.Text.Json.Serialization;

public class ConsignmentLine
{
    public int ConsignmentLineId { get; set; }
    public int ConsignmentId { get; set; } 
    public string FishType { get; set; } 
    public int Quantity { get; set; }
    public string ImageUrl { get; set; }
    public string CertificationUrl { get; set; }
    public int TotalPrice { get; set; }
    [JsonIgnore]
    public Consignment Consignment { get; set; }
    public int UnitPrice { get; set; }

}
