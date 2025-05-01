using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities
{
    public class SignInRequest
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class SignInResponse
    {
        public bool IsSuccess { get; set; }

        public string Message { get; set; }
    }
}
