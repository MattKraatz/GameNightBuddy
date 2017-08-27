using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Constants
{
  public class LoggingEvents
  {
    // Auth events
    public const int GetUser = 1000;
    public const int UpdateUser = 1001;
    public const int QueryUsers = 1002;
    public const int InsertUser = 1003;

    // GameNight events
    public const int GetMyGameNights = 2000;
    public const int GetOtherGameNights = 2001;
    public const int GetGameNightById = 2002;
    public const int GetGameNightNotifications = 2003;
    public const int AddMember = 2010;
    public const int UpdateMember = 2004;
    public const int AddGameToGameNight = 2005;
    public const int AddMatch = 2006;
    public const int UpdateMatch = 2007;
    public const int CreateMatch = 2008;
    public const int GetAllGameNights = 2009;
    public const int GetMember = 2011;
    public const int CreateGameNight = 2012;
    public const int DeactiveGameNight = 2013;
    public const int UpdateGameNight = 2014;
    public const int DeactivateMember = 2015;

    // Game events
    public const int GetMyGames = 3000;
    public const int CreateGame = 3001;
    public const int UpdateGameRating = 3002;
    public const int CreateGameAndAddToGameNight = 3003;
    public const int UpdateGame = 3004;
    public const int DeleteGameRating = 3005;
    public const int GetGameRecommendation = 3006;
    public const int DeactivateGame = 3007;

    // Activity events
    public const int CreateActivity = 6000;
    public const int GetActivityByGameNight = 6001;

    // Save events
    public const int Save = 5000;

    // Error events
    public const int InvalidInput = 4000;
    public const int GetFailed = 4001;
    public const int UpdateFailed = 4002;
    public const int SaveError = 4003;
    public const int Unexpectederror = 9999;
  }
}
