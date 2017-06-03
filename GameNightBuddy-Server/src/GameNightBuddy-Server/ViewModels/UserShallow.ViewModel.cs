using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.ViewModels
{
  public class UserShallowViewModel
  {
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DisplayName { get; set; }
    public string PhotoURL { get; set; }

    public UserShallowViewModel() { }

    public UserShallowViewModel(User user)
    {
      if (user != null)
      {
        UserId = user.UserId;
        FirstName = user.FirstName;
        LastName = user.LastName;
        DisplayName = user.DisplayName;
        PhotoURL = user.PhotoURL;
      }
    }
  }
}
