using Microsoft.AspNetCore.Identity;

namespace OnlineStore.Core.Entities;

public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}