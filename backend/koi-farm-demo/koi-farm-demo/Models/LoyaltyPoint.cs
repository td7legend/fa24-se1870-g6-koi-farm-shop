public class LoyaltyPoint
{
    public int LPId { get; set; }
    public int CustomerId { get; set; }
    public decimal Amount { get; set; }
    public DateTime AwardedDate { get; set; }

    public Customer Customer { get; set; }
}
