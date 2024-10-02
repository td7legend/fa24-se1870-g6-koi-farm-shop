namespace koi_farm_demo.Data
{
    public class OrderDTO
    {
        public int OrderId { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalDiscount { get; set; }
        public int CustomerId { get; set; }
        public List<OrderLineDTO> OrderLines { get; set; }
    }
}
