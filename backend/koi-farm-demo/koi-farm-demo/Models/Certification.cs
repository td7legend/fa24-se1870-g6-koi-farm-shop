public class Certification
{
    public int CertificationId { get; set; }
    public int FishId { get; set; }
    public string Description { get; set; }
    public DateTime IssueDate { get; set; }
    public Fish Fish { get; set; }
}
