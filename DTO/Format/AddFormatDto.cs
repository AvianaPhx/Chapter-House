using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Format
{
    public class AddFormatDto
    {
        [Required]
        public required string FormatName { get; set; }
    }
}
