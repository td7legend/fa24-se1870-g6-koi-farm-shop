public class OrderLine
{
    public int OrderId { get; set; } 
    public int FishId { get; set; } 
    public int Quantity { get; set; } 
    public decimal UnitPrice { get; set; } 
    public decimal TotalPrice { get; set; } 
    public Fish Fish { get; set; } 
    public Order Order { get; set; } 
}
