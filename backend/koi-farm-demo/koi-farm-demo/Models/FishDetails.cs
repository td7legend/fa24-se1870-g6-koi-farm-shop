namespace koi_farm_demo.Models
{
    public class FishDetails
    {
        public string Name { get; set; }
        public FishGender Gender { get; set; }
        public int Age { get; set; }
        public decimal Size { get; set; }
        public string Class { get; set; }
        public int FoodRequirement { get; set; }
        public decimal OverallRating { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public int FishTypeId { get; set; }
    }
}
