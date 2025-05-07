namespace Chapter_House.DTO.Banner
{
    public class BannerDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Starts { get; set; }
        public DateTime Ends { get; set; }
        public bool IsActive { get; set; }
    }
}
