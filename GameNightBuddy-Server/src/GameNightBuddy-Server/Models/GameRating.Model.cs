using GameNightBuddy_Server.ViewModels;
using System;

namespace GameNightBuddy_Server.Models
{
  public class GameRating
  {
    // Primary Key
    public Guid GameRatingId { get; set; }

    // Foreign Keys
    public Guid UserId { get; set; }
    public User User { get; set; }
    public Guid GameId { get; set; }
    public Game Game { get; set; }
    // Foreign Keys Elsewhere

    // Unique Columns
    public int Rating { get; set; }

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public Boolean IsActive { get; set; }

    public GameRating() { }

    public GameRating(GameRatingViewModel vm) {
      UserId = new Guid(vm.UserId);
      GameId = new Guid(vm.GameId);
      Rating = vm.Rating;
    }
    
  }
}
