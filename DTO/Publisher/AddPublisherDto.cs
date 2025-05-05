using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Publisher
{
    public class AddPublisherDto
    {
        [Required, MaxLength(150)]
        public string PublisherName { get; set; } = string.Empty;
    }
}
