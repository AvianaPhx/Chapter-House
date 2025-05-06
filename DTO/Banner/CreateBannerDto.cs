namespace Chapter_House.DTO.Banner
{
    public class CreateBannerDto
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Starts { get; set; }
        public DateTime Ends { get; set; }
        public bool IsActive { get; set; }
    }
}
