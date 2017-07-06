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

    public int Rating { get; set; }

    public DateTime DateCreated { get; set; }
    public Boolean IsActive { get; set; }

    public GameRating() { }

    public GameRating(GameRatingViewModel vm) {
      UserId = new Guid(vm.UserId);
      GameId = new Guid(vm.GameId);
      Rating = vm.Rating;
    }
    
  }
}
