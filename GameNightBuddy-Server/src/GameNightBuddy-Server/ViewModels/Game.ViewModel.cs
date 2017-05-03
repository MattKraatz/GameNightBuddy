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
  }
}
