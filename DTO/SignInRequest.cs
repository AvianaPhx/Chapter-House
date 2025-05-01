using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO
{
    public class SignInRequest
    {
        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; init; } = string.Empty;
    }
}
