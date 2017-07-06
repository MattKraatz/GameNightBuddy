using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameNightShallowViewModel
  {
    public string GameNightId;
    public string Name;
    public List<MemberViewModel> Members;
    public List<GameShallowViewModel> Games;
    public List<MatchViewModel> Matches;
    public string DateCreated;

    public GameNightShallowViewModel() { }

    public GameNightShallowViewModel(GameNight night)
    {
      GameNightId = night.GameNightId.ToString();
      Name = night.Name;
      Matches = night.Matches.Select(m => new MatchViewModel(m)).ToList();
      Games = night.Games.Select(gng => new GameShallowViewModel(gng)).ToList();
      Members = night.Members.Select(m => new MemberViewModel(m)).ToList();
      DateCreated = night.DateCreated.ToString();
    }
  }
}