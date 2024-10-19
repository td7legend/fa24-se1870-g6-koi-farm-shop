namespace koi_farm_demo.Data
{
    public class OrderHistoryDTO
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
    }
}
