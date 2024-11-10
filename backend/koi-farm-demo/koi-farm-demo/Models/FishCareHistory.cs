namespace koi_farm_demo.Models
{
    public class FishCareHistory
    {
        public int FishCareHistoryId { get; set; }
        public int FishCareId { get; set; } // Khóa ngoại đến FishCare
        public FishCare FishCare { get; set; }
        public DateTime CareDate { get; set; } // Ngày thực hiện chăm sóc
        public string HealthStatus { get; set; } // Tình trạng sức khỏe vào ngày chăm sóc
        public string CareDetails { get; set; }
    }
}
