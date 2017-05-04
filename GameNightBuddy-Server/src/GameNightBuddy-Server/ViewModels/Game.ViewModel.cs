using GameNightBuddy_Server.Models;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameViewModel
  {
    public string GameId;
    public string Name;
    public int MinPlayers;
    public int MaxPlayers;
    public User Owner;
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
      Owner = game.User;
      DateCreated = game.DateCreated.ToString();
    }
  }
}
