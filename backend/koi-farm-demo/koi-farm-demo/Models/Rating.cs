public class Rating
{
    public int RatingId { get; set; }
    public int FishId { get; set; }
    public int RatingValue { get; set; }
    public string Comment { get; set; }
    public int CustomerId { get; set; }

    public Customer Customer { get; set; }
    public Fish Fish { get; set; }
}
