public class Order
{
    public int OrderId { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalDiscount { get; set; }
    public DateTime? OrderDate { get; set; }
    public int CustomerId { get; set; }  // Khóa ngoại liên kết với bảng Customer // Navigation property tới bảng Customer

    public ICollection<OrderLine> OrderLines { get; set; }  // Nhiều OrderLine
    public string? Address { get; set; } 

}

public enum OrderStatus
{
    InCart = 0,
    Paid = 1,
    Cancelled = 2
}
