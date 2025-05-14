using Chapter_House.DTO.Order;

namespace Chapter_House.DTO.Books
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public UserDto User { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
    }
}