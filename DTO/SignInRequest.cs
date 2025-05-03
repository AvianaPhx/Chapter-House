using Chapter_House.Entities;
using System.ComponentModel.DataAnnotations;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.DTO
{
    public class SignInRequest
    {
        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; init; } = string.Empty;

        [Required]
        public Role Role { get; set; }
    }
}
