using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Core
{
    public class BookOrderHistory
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key Order
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        [Required]
        public string OrderStatus { get; set; } = "Pending";

        public DateTime ChangeDate { get; set; } = DateTime.UtcNow;
    }
}
