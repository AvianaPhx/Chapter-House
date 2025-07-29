namespace Chapter_House.DTO.Whitelist
{
    public class WhitelistItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string AuthorName { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Isbn { get; set; }
        public int Stock { get; set; }
        public bool OnSale { get; set; }
        public decimal DiscountedPercentage { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        public string? Image { get; set; }
        public decimal Rating { get; set; }
        public string? GenreName { get; set; }
        public string? FormatName { get; set; }
        public string? PublisherName { get; set; }
        public string? Language { get; set; }
    }
}
