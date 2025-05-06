using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Genre
{
    public class UpdateGenreDto
    {
        [Required, MaxLength(100)]
        public string GenreName { get; set; } = string.Empty;
    }
}
