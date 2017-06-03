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

    public Boolean Winner { get; set; }
    public float? Score { get; set; }
    public Boolean FirstTimer { get; set; }
    public string Team { get; set; }

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
