namespace koi_farm_demo.Models
{
    public class CreateCareConsignmentRequest
    {
        public decimal CareFee { get; set; }
        public int StaffId { get; set; }
        public int CustomerId { get; set; }
        public string Note { get; set; }
        public List<ConsignmentLineRequest> ConsignmentLines { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
