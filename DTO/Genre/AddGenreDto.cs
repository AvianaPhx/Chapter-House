using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.Genre
{
    public class AddGenreDto
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string GenreName { get; set; } = string.Empty;
    }
}
