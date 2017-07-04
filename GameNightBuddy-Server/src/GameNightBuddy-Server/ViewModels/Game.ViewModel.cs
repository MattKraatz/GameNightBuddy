using GameNightBuddy_Server.Models;
using System.Collections.Generic;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameViewModel
  {
    public string GameId;
    public string Name;
    public int MinPlayers;
    public int MaxPlayers;
    public UserShallowViewModel Owner;
    public List<GameRating> Ratings;
    public string DateCreated;

    public GameViewModel() { }

    public GameViewModel(Game game)
    {
      if (game != null)
      {
        ExtractGameProperties(game);
      }
    }

    public GameViewModel(GameNightGame gng)
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
      Ratings = game.GameRatings;
      DateCreated = game.DateCreated.ToString();
    }
  }
}
