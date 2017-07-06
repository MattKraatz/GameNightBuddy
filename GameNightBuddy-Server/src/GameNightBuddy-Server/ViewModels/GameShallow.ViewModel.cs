using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameShallowViewModel
  {
    public string GameId;
    public string Name;
    public int MinPlayers;
    public int MaxPlayers;
    public UserShallowViewModel Owner;
    public double AvgRating;
    public string DateCreated;

    public GameShallowViewModel() { }

    public GameShallowViewModel(Game game)
    {
      if (game != null)
      {
        ExtractGameProperties(game);
      }
    }

    public GameShallowViewModel(GameNightGame gng)
    {
      var game = gng.Game;
      if (game != null)
      {
        ExtractGameProperties(game);
      }
    }

    private void ExtractGameProperties(Game game)
    {
      GameId = game.GameId.ToString();
      Name = game.Name;
      MinPlayers = game.MinPlayers;
      MaxPlayers = game.MaxPlayers;
      Owner = new UserShallowViewModel(game.User);
      AvgRating = game.GameRatings?.Count > 1 ? game.GameRatings.Average(r => r.Rating) : 0;
      DateCreated = game.DateCreated.ToString();
    }

  }
}
