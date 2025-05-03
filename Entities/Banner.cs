using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities
{
    public class Banner
    {
        [Key] public int Id { get; set; }

        [Required, MaxLength(150)] public string Title { get; set; } = string.Empty;

        public string? Message { get; set; }
        public string? ImageUrl { get; set; }

        public DateTime Starts { get; set; }
        public DateTime Ends { get; set; }

        public bool IsActive => DateTime.UtcNow >= Starts && DateTime.UtcNow <= Ends;
    }
}
