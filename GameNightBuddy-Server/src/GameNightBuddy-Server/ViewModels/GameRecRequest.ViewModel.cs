using System;
using System.Collections.Generic;

namespace GameNightBuddy_Server.ViewModels
{
  public class GameRecRequestViewModel
  {
    public Guid GameNightId;
    public List<Guid> UserIds;

    public GameRecRequestViewModel() { }
  }
}