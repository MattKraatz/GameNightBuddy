using GameNightBuddy_Server.ViewModels;
using System;

namespace GameNightBuddy_Server.Models
{
  public class Activity
  {
    // Primary Key
    public int ActivityId { get; set; }

    // Foreign Keys
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid? GameNightId { get; set; }
    public GameNight GameNight { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns
    public string ActivityType { get; set; }
    public string EntityType { get; set; }
    public Guid EntityId { get; set; }

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }

    public Activity() { }
    
  }
}
