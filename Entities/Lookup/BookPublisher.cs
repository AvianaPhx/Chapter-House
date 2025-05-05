using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Lookup
{
    public class BookPublisher
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string PublisherName { get; set; } = string.Empty;
    }
}
