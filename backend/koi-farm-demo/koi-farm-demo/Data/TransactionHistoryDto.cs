namespace koi_farm_demo.Data
{
    public class TransactionHistoryDto
    {
        public int OrderId { get; set; }
        public DateTime? Date { get; set; }
        public string Status { get; set; }
        public decimal Amount { get; set; }
    }
}
