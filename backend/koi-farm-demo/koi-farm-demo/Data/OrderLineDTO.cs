namespace koi_farm_demo.Data
{
    public class OrderLineDTO
    {
        public int FishId { get; set; }
        public string FishName { get; set; }  // Assuming Fish entity has a Name property
        public string ImageUrl { get; set; }  // Assuming Fish entity has an ImageUrl property
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
