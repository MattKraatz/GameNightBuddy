using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class Match
  {
    // Primary Key
    public Guid MatchId { get; set; }
    // Foreign Keys
    [Required]
    public Guid GameId { get; set; }
    public Game Game { get; set; }
    [Required]
    public Guid GameNightId { get; set; }
    public GameNight GameNight { get; set; }
    // Foreign Keys Elsewhere
    public List<MatchPlayer> Players { get; set; }

    // Unique Columns
    [Required]
    public DateTime Date { get; set; }

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public bool IsActive { get; set; }

    public Match() { }

    public Match(MatchViewModel vm)
    {
      GameId = new Guid(vm.Game.GameId);
      Date = Convert.ToDateTime(vm.Date);
    }
  }
}
