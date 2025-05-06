using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Author
{
    public class AddAuthorDto
    {
        [Required]
        public required string AuthorName { get; set; }
    }
}
