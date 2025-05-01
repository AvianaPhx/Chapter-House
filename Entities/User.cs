using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities
{
    public class User
    {

        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;


        public string? Address { get; set; }
        public string? MembershipStatus { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
