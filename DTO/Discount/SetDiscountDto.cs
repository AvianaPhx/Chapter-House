namespace Chapter_House.DTO.Discount
{
    public class SetDiscountDto
    {
        public decimal? DiscountedPercentage { get; set; }  
        public decimal? TotalPrice { get; set; }   
        public DateTime StartDate { get; set; }  
        public DateTime EndDate { get; set; }
    }
}
