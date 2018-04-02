using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class GameNightGame
  {
    // Primary Key
    public Guid GameNightGameId { get; set; }
    // Foreign Keys
    [Required]
    public Guid GameNightId { get; set; }
    public GameNight GameNight { get; set; }
    [Required]
    public Guid GameId { get; set; }
    public Game Game { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public Boolean IsActive { get; set; }
  }
}
