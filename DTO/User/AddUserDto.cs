using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.User
{
    public class AddUserDto
    {
        [Required, MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        public string? Address { get; set; }
    }
}
