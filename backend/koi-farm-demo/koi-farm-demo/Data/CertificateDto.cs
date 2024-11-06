namespace koi_farm_demo.Data
{
    public class CertificateCreateDto
    {
        public string Description { get; set; }
        public DateTime IssueDate { get; set; }
        public string Url { get; set; }
    }

    public class CertificateDto
    {
        public int CertificationId { get; set; }
        public string Description { get; set; }
        public DateTime IssueDate { get; set; }
        public string Url { get; set; }
    }

}
