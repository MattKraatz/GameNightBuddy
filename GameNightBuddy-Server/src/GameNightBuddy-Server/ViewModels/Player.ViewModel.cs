using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.ViewModels
{
  public class PlayerViewModel : MemberViewModel
  {
    public bool FirstTime;
    public bool Winner;
    public int? Score;
    public string Team;

    public PlayerViewModel() { }

    public PlayerViewModel(MatchPlayer player) : base(player)
    {
      FirstTime = player.FirstTimer;
      Winner = player.Winner;
      if (player.Score.HasValue) Score = (int)player.Score;
      Team = player.Team;
    }
  }
}
