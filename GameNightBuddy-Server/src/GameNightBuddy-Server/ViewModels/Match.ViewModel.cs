using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.ViewModels
{
  public class MatchViewModel
  {
    public string MatchId;
    public string Date;
    public GameShallowViewModel Game;
    public List<PlayerViewModel> Players;

    public MatchViewModel() { }

    public MatchViewModel(Match match)
    {
      MatchId = match.MatchId.ToString();
      Date = match.Date.ToString("MM/dd/yyyy");
      Game = new GameShallowViewModel(match.Game);
      Players = match.Players.Select(p => new PlayerViewModel(p)).ToList();
    }
  }
}
