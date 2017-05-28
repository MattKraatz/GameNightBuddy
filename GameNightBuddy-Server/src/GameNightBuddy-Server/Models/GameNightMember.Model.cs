using GameNightBuddy_Server.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
  public class GameNightMember
  {
    // Primary Key
    public Guid GameNightMemberId { get; set; }
    // Foreign Keys
    [Required]
    public Guid GameNightId { get; set; }
    public GameNight GameNight { get; set; }
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }
    public List<MatchPlayer> MatchPlayers { get; set; }

    public Boolean IsHost { get; set; }

    public DateTime DateCreated { get; set; }
    public Boolean IsActive { get; set; }

    public GameNightMember() { }

    public GameNightMember(MemberViewModel vm, Guid nightId)
    {
      GameNightId = nightId;
      UserId = vm.UserId;
      IsHost = vm.IsHost;
    }

    public GameNightMember(User vm, Guid nightId)
    {
      GameNightId = nightId;
      UserId = vm.UserId;
      IsHost = false;
    }
  }
}
