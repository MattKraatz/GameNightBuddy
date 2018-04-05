using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;

namespace GameNightBuddy_Server.ViewModels
{
  public class UserStatViewModel
  {
    public int GamesInCollectionCount { get; set; }
    public int MatchesPlayedCount { get; set; }
    public int MatchesWonCount { get; set; }
    public Dictionary<int, Game> FavoriteGames { get; set; }
    public Dictionary<int, Game> MostWonGames { get; set; }
    public List<Game> FirstTimerWins { get; set; }

    public UserStatViewModel() { }

    public UserStatViewModel(UserStat stat)
    {
      if (stat != null)
      {
        GamesInCollectionCount = stat.GamesInCollectionCount;
        MatchesPlayedCount = stat.MatchesPlayedCount;
        MatchesWonCount = stat.MatchesWonCount;
        FavoriteGames = new Dictionary<int, Game>();
        MostWonGames = new Dictionary<int, Game>();
        FirstTimerWins = new List<Game>();
        foreach(var entity in stat.UserStatEntities)
        {
          if (entity.IsFavoriteGame)
          {
            FavoriteGames.Add(entity.Rank, entity.GameEntity);
          } else if (entity.IsMostWonGame)
          {
            MostWonGames.Add(entity.Rank, entity.GameEntity);
          } else if (entity.IsFirstTimerWinGame)
          {
            FirstTimerWins.Add(entity.GameEntity);
          }
        }
      }
    }
  }
}
