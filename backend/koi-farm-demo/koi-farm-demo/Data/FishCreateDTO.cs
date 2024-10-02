namespace koi_farm_demo.Data
{
    // FishCreateDto.cs
    public class FishCreateDto
    {
        public string Name { get; set; }
        public FishGender Gender { get; set; }
        public int Age { get; set; }
        public decimal? Size { get; set; } // Có thể là null
        public string Class { get; set; }
        public int? FoodRequirement { get; set; } // Có thể là null
        public decimal? OverallRating { get; set; } // Có thể là null
        public long? Price { get; set; } // Có thể là null
        public bool? Batch { get; set; } // Có thể là null
        public int FishTypeId { get; set; }  // Khóa ngoại liên kết với bảng FishType // Navigation property tới bảng FishType                            
        
    }

}
