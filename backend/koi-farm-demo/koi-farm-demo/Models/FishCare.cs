namespace koi_farm_demo.Models
{
    public class FishCare
    {
        public int FishCareId { get; set; }
        public string FishType { get; set; }
        public int ConsignmentId { get; set; }
        public string StandardCareDetails { get; set; } // Yêu cầu chăm sóc tiêu chuẩn
        public string StandardHealthStatus { get; set; }
    }
}
