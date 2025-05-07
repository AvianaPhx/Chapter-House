using System.ComponentModel.DataAnnotations;

namespace Chapter_House.DTO.SignUp
{
    public class SignUpRequest
    {
        [Required, MaxLength(50)]
        public string UserName { get; init; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; init; } = string.Empty;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; init; } = string.Empty;

        [Required, Compare(nameof(Password), ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; init; } = string.Empty;
    }
}
