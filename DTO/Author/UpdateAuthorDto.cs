using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Author
{
    public class UpdateAuthorDto
    {
        [Required]
        public required string AuthorName { get; set; }
    }
}
