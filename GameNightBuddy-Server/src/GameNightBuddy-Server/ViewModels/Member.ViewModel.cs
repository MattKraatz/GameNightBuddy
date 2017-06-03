using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.ViewModels
{
  public class MemberViewModel : UserShallowViewModel
  {
    public string MemberId;
    public bool IsHost;
    public string DateJoined;

    public MemberViewModel() { }

    public MemberViewModel(MatchPlayer player): base(player.Member.User)
    {
      MemberId = player.Member.GameNightMemberId.ToString();
      IsHost = player.Member.IsHost;
      DateJoined = player.Member.DateCreated.ToString();
    }

    public MemberViewModel(GameNightMember member): base(member.User)
    {
      MemberId = member.GameNightMemberId.ToString();
      IsHost = member.IsHost;
      DateJoined = member.DateCreated.ToString();
    }
  }
}
