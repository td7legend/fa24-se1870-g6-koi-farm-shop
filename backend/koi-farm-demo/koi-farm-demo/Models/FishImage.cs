namespace koi_farm_demo.Models
{
    public class FishImage
    {
        public int FishImageId { get; set; }
        public int FishId { get; set; }
        public Fish Fish { get; set; }
        public string ImageUrl { get; set; }
        
    }
}
