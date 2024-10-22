public class Fish
{
    public int FishId { get; set; }
    public string Name { get; set; }
    public FishGender Gender { get; set; }
    public int Age { get; set; }
    public decimal Size { get; set; }
    public string Class { get; set; }
    public int FoodRequirement { get; set; }
    public decimal OverallRating { get; set; }
    public long Price { get; set; }
    public int? ConsignmentLineId { get; set; }
    public bool Batch { get; set; }
    public int FishTypeId { get; set; }
    public FishType FishType { get; set; }
    public ICollection<OrderLine> OrderLines { get; set; }
    public int Quantity { get; set; }
    public string ImageUrl { get; set; }
}

public enum FishGender
{
    Male = 0,
    Female = 1
}
