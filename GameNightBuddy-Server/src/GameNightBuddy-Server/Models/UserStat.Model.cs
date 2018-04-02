using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class UserStat
  {
    // Primary Key
    public Guid UserStatId { get; set; }
    // Foreign Keys
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid GameMostPlayedGameId { get; set; }
    public Game GameMostPlayedGame { get; set; }
    public Guid GameMostWonGameId { get; set; }
    public Game GameMostWonGame { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns
    public int GameMostPlayedCount { get; set; }
    public int GamesInCollectionCount { get; set; }
    public int MatchesPlayedCount { get; set; }
    public int MatchesWonCount { get; set; }
    public int GameMostWonPlayCount { get; set; }
    public int GameMostWonWinCount { get; set; }

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public Boolean IsActive { get; set; }
  }
}
