using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;

namespace GameNightBuddy_Server.Models
{
  public class Game
  {
    // Primary Key
    public Guid GameId { get; set; }

    // Foreign Key
    public Guid UserId { get; set; }
    public User User { get; set; }
    public List<GameNightGame> GameNightGames { get; set; }
    public List<Match> Matches { get; set; }
    public List<GameRating> GameRatings { get; set; }
    
    public string Name { get; set; }
    public int MinPlayers { get; set; }
    public int MaxPlayers { get; set; }

    public DateTime DateCreated { get; set; }
    public Boolean IsActive { get; set; }

    public Game() { }

    public Game(GameViewModel vm)
    {
      GameId = vm.GameId.Length > 0 ? new Guid(vm.GameId) : new Guid();
      UserId = vm.Owner.UserId;
      Name = vm.Name;
      MinPlayers = vm.MinPlayers;
      MaxPlayers = vm.MaxPlayers;
    }
  }
}
