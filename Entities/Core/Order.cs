using System.Text.Json.Serialization;

namespace Chapter_House.Entities.Core
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";

        public decimal TotalAmount { get; set; }

        [JsonIgnore]
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
