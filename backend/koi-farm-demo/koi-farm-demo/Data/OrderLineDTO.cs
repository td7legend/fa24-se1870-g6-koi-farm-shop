namespace koi_farm_demo.Data
{
    public class OrderLineDTO
    {
        public int OrderId { get; set; }  
        public int FishId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
