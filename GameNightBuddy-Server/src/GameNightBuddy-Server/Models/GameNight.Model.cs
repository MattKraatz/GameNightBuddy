using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class GameNight
  {
    // Primary Key
    public Guid GameNightId { get; set; }
    // Foreign Keys
    [Required]
    public Guid UserId { get; set; }
    public User UserCreator { get; set; }
    // Foreign Keys Elsewhere
    public List<GameNightMember> Members { get; set; }
    public List<GameNightGame> Games { get; set; }
    public List<Match> Matches { get; set; }
    public List<Activity> Activities { get; set; }

    // Unique Columns
    [Required]
    public string Name { get; set; } 

    // Default
    public DateTime DateCreated { get; set; }
    public string UserCreated { get; set; }
    public DateTime DateUpdated { get; set; }
    public string UserUpdated { get; set; }
    public Boolean IsActive { get; set; }

    public GameNight() { }

    public GameNight(GameNightViewModel vm)
    {
      Name = vm.Name;
    }
  }
}
