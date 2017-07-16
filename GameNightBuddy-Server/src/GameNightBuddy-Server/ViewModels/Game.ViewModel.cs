using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameViewModel
  {
    public string GameId;
    public string Name;
    public int MinPlayers;
    public int MaxPlayers;
    public UserShallowViewModel Owner;
    public double AvgRating;
    public int MyRating;
    public string DateCreated;

    public GameViewModel() { }

    public GameViewModel(Game game, Guid userId)
    {
      if (game != null)
      {
        ExtractGameProperties(game, userId);
      }
    }

    public GameViewModel(GameNightGame gng, Guid userId)
    {
      var game = gng.Game;
      if (game != null)
      {
        ExtractGameProperties(game, userId);
      }
    }

    private void ExtractGameProperties(Game game, Guid userId)
    {
      GameId = game.GameId.ToString();
      Name = game.Name;
      MinPlayers = game.MinPlayers;
      MaxPlayers = game.MaxPlayers;
      Owner = new UserShallowViewModel(game.User);
      AvgRating = game.GameRatings != null && game.GameRatings?.Count > 1 ? game.GameRatings.Average(r => r.Rating) : 0;
      MyRating = game.GameRatings != null && game.GameRatings?.Count > 0 && game.GameRatings.FirstOrDefault(r => r.UserId == userId) != null ? game.GameRatings.FirstOrDefault(r => r.UserId == userId).Rating : 0;
      DateCreated = game.DateCreated.ToString();
    }
  }
}
