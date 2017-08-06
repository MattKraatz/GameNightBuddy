using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Constants
{
  public static class Activities
  {
    public static ActivityTypes ActivityTypes = new ActivityTypes();
    public static Entities Entities = new Entities();
  }

  public class ActivityTypes
  {
    public string CREATE = "CREATE";
    public string UPDATE = "UPDATE";
  }

  public class Entities
  {
    public string GAME = "GAME";
    public string MEMBER = "MEMBER";
    public string MATCH = "MATCH";
    public string GAMENIGHT = "GAMENIGHT";
  }
}
