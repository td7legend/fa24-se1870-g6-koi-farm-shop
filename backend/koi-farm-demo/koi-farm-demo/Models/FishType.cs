public class FishType
{
    public int FishTypeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public ICollection<Fish> Fishes { get; set; }
}
