using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class MatchPlayer
  {
    // Primary Key
    public Guid MatchPlayerId { get; set; }
    // Foreign Key
    [Required]
    public Guid MatchId { get; set; }
    public Match Match { get; set; }
    [Required]
    public Guid GameNightMemberId { get; set; }
    public GameNightMember Member { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns
    public Boolean Winner { get; set; }
    public float? Score { get; set; }
    public Boolean FirstTimer { get; set; }
    public string Team { get; set; }

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public bool IsActive { get; set; }

    public MatchPlayer() { }

    public MatchPlayer(PlayerViewModel vm)
    {
      GameNightMemberId = new Guid(vm.MemberId);
      Winner = vm.Winner;
      Score = vm.Score;
      FirstTimer = vm.FirstTime;
      Team = vm.Team;
    }
  }
}
