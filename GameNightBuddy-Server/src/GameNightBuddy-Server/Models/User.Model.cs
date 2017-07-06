using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class User
  {
    // Primary Key
    public Guid UserId { get; set; }
    // Foreign Keys
    public List<GameNightMember> GameNightsMembers { get; set; }
    public List<Game> Games { get; set; }
    public List<GameRating> GameRatings { get; set; }

    [Required]
    public string FirebaseId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
    public string PhotoURL { get; set; }
    public string Email { get; set; }

    public DateTime DateCreated { get; set; }
    public Boolean IsActive { get; set; }

    public User() { }

    public User(User user)
    {
      UserId = user.UserId;
      FirstName = user.FirstName;
      LastName = user.LastName;
      DisplayName = user.DisplayName;
      PhotoURL = user.PhotoURL;
    }

    public User(AuthViewModel auth)
    {
      FirebaseId = auth.uid;
      DisplayName = auth.displayName;
      Email = auth.email;
    }
  }
}
