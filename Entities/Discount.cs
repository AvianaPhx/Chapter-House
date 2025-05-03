using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.Entities
{
    public class Discount
    {
        [Key] public int Id { get; set;}

        [Required] public string Name { get; set; } = string.Empty;
        public DiscountKind Kind { get; set; } = DiscountKind.Percentage;

        [Column(TypeName="decimal(10,2)")] public decimal Value { get; set; }

        public int? MinBooks { get; set; }
        public int? MinOrders { get; set; }
        public bool Stackable { get; set; }

        public DateTime? Starts { get; set; }
        public DateTime? Ends   { get; set; }
        

       
    }
}

