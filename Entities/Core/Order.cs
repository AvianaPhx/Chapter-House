using Chapter_House.Entities.Commerce;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.Entities.Core
{
    public class Order
    {
        [Key] 
        public int Id { get; set; }
        public string ClaimCode { get; set; } = string.Empty;
        public bool Cancelled { get; set; }
        public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> Items { get; set; } = [];

        /* Foreign Keys */
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
