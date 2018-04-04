using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class UserStatEntity
  {
    // Primary Key
    public Guid UserStatEntityId { get; set; }
    // Foreign Keys
    [Required]
    public Guid UserStatId { get; set; }
    public UserStat UserStat { get; set; }
    public Guid GameEntityId { get; set; }
    public Game GameEntity { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns
    public int Rank { get; set; }
    public int PlayCount { get; set; }
    public int WinCount { get; set; }
    public bool IsFavoriteGame { get; set; }
    public bool IsMostWonGame { get; set; }
    public bool IsFirstTimerWinGame { get; set; }
    
    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public Boolean IsActive { get; set; }
  }
}
