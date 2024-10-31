namespace koi_farm_demo.Models
{
    public class FishCare
    {
        public int FishCareId { get; set; }
        public string FishType { get; set; }
        public int ConsignmentId { get; set; }
        public string HealthStatus { get; set; } 
        public string CareDetails { get; set; }
    }
}
