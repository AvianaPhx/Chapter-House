using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Chapter_House.Entities.Core
{
    public class User : IdentityUser<int>
    {
        public string? Address { get; set; }
        public string? MembershipStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}