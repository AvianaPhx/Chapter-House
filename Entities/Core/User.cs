using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.ComponentModel.DataAnnotations;
using static Chapter_House.Entities.Enums.Helpers;

namespace Chapter_House.Entities.Core
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

        [Required]
        public Role Role { get; set; } = Role.User;


        public string? Address { get; set; }
        public string? MembershipStatus { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
