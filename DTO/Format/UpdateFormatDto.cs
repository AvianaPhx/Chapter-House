using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Format
{
    public class UpdateFormatDto
    {
        [Required]
        public required string Format { get; set; }
    }
}
