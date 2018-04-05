using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Constants;
using Microsoft.Extensions.Logging;

namespace GameNightBuddy_Server.Repositories
{
  public interface IUserRepository : IDisposable
  {
    User GetUserByAuthKey(string id);
    List<User> QueryUsers(string query, Guid nightId);
    User GetUser(Guid id);
    Guid InsertUser(User user);
    void DeactivateUser(Guid userId);
    void UpdateUser(User user);
    UserStat GetUserStats(Guid id);
    void Save();
  }

  public class UserRepository : IUserRepository
  {
    private Context context;
    private readonly ILogger _logger;

    public UserRepository(Context context, ILogger<UserRepository> logger)
    {
      this.context = context;
      this._logger = logger;
    }

    /// <summary>
    /// Gets a full User record by authentication key.
    /// </summary>
    /// <param name="id">The identifier.</param>
    /// <returns></returns>
    public User GetUserByAuthKey(string id)
    {
      if (id?.Length < 1) return new User();
      _logger.LogInformation(LoggingEvents.GetUser, "Starting GetUserByFbKey {timestamp}", DateTime.Now);

      try
      {
        var user = this.context.Users
          .Include(u => u.Games)
            .ThenInclude(g => g.User)
          .FirstOrDefault(u => u.FirebaseId == id);

        _logger.LogInformation(LoggingEvents.GetUser, "Ending GetUserByFbKey {timestamp}", DateTime.Now);
        return user;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetFailed, ex, "GetUserByFbKey ERROR at {timestamp}", DateTime.Now);
        return new User();
      }
    }

    /// <summary>
    /// Returns public Users via string query that are eligible for joining a specific Game Night.
    /// Supported queries: display name, first name + last name
    /// </summary>
    /// <param name="query">String search query</param>
    /// <param name="nightId">Game Night context</param>
    /// <returns></returns>
    public List<User> QueryUsers(string query, Guid nightId)
    {
      if (query?.Length < 1 || nightId == Guid.Empty) return new List<User>();
      _logger.LogInformation(LoggingEvents.QueryUsers, "Starting QueryUsers {timestamp}", DateTime.Now);

      try
      {
        var memberIds = this.context.GameNightMembers.Where(m => m.GameNightId == nightId).Select(m => m.UserId).ToList();
        query = query.ToLower();
        var users = this.context.Users.Where(u => !memberIds.Contains(u.UserId) &&
            (
              (u.DisplayName != null && u.DisplayName.ToLower().Contains(query)) ||
              string.Concat(u.FirstName + u.LastName).ToLower().Contains(query))
             ).ToList();

        _logger.LogInformation(LoggingEvents.QueryUsers, "Ending QueryUsers {timestamp}", DateTime.Now);
        return users;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.QueryUsers, ex, "QueryUsers ERROR at {timestamp}", DateTime.Now);
        return new List<User>();
      }
    }

    public void DeactivateUser(Guid userId)
    {
      throw new NotImplementedException();
    }

    public User GetUser(Guid id)
    {
      throw new NotImplementedException();
    }

    /// <summary>
    /// Inserts a new User.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <returns></returns>
    public Guid InsertUser(User user)
    {
      if (user == null) return Guid.Empty;
      _logger.LogInformation(LoggingEvents.InsertUser, "Starting InsertUser {timestamp}", DateTime.Now);

      try
      {
        this.context.Users.Add(user);

        _logger.LogInformation(LoggingEvents.InsertUser, "Ending InsertUser {timestamp}", DateTime.Now);
        return user.UserId;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.InsertUser, ex, "InsertUser ERROR at {timestamp}", DateTime.Now);
        return Guid.Empty;
      }
    }

    /// <summary>
    /// Updates an existing User.
    /// </summary>
    /// <param name="user">The user.</param>
    public void UpdateUser(User user)
    {
      if (user == null) return;
      _logger.LogInformation(LoggingEvents.UpdateUser, "Starting UpdateUser {timestamp}", DateTime.Now);

      try
      {
        var dbUser = this.context.Users.FirstOrDefault(u => u.UserId == user.UserId);
        if (dbUser != null)
        {
          dbUser.FirstName = user.FirstName;
          dbUser.LastName = user.LastName;
          dbUser.Email = user.Email;
          dbUser.DisplayName = user.DisplayName;
          dbUser.PhotoURL = user.PhotoURL;
        }

        _logger.LogInformation(LoggingEvents.UpdateUser, "Ending UpdateUser {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateUser, ex, "UpdateUser ERROR at {timestamp}", DateTime.Now);
        return;
      }
    }

    /// <summary>
    /// Gets a full User record by UserId.
    /// </summary>
    /// <param name="id">The UserId.</param>
    /// <returns></returns>
    public UserStat GetUserStats(Guid id)
    {
      if (id == Guid.Empty) return new UserStat();
      _logger.LogInformation(LoggingEvents.GetUser, "Starting GetUserStats {timestamp}", DateTime.Now);

      try
      {
        CalculateUserStats(id);

        var userStat = this.context.UserStats
          .Include(u => u.UserStatEntities)
            .ThenInclude(e => e.GameEntity)
          .FirstOrDefault(u => u.UserId == id);

        _logger.LogInformation(LoggingEvents.GetUser, "Ending GetUserStats {timestamp}", DateTime.Now);
        return userStat;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetFailed, ex, "GetUserStats ERROR at {timestamp}", DateTime.Now);
        return new UserStat();
      }
    }

    /// <summary>
    /// Calculates User stats.
    /// </summary>
    /// <param name="id">The UserId.</param>
    /// <returns></returns>
    public void CalculateUserStats(Guid id)
    {
      if (id == Guid.Empty) return;
      _logger.LogInformation(LoggingEvents.GetUser, "Starting CalculateUserStats {timestamp}", DateTime.Now);

      try
      {
        var userStat = new UserStat
        {
          UserId = id,
          DateCreated = DateTime.Now,
          IsActive = true
        };

        var user = this.context.Users
          .Include(u => u.Games)
          .FirstOrDefault(u => u.UserId == userStat.UserId);

        if (user == null)
        {
          _logger.LogError(LoggingEvents.GetUser, "CalculateUserStats ERROR at {timestamp} : User does not exist", DateTime.Now);
          return;
        }

        var userMatchPlayers = this.context.MatchPlayers
          .Include(p => p.Member)
          .Include(p => p.Match)
            .ThenInclude(m => m.Game)
          .Where(p => p.Member.UserId == userStat.UserId);

        // # of Games in personal collection
        userStat.GamesInCollectionCount = user.Games.Count();

        // # of Matches played and won across all Game Nights (can calculate ratio)
        userStat.MatchesPlayedCount = userMatchPlayers.Count();
        userStat.MatchesWonCount = userMatchPlayers.Where(p => p.Winner).Count();

        var oldUserStatEntities = this.context.UserStatEntities
          .Include(e => e.UserStat)
          .Where(e => e.UserStat.UserId == userStat.UserId);
        if (oldUserStatEntities.Count() > 0)
        {
          this.context.UserStatEntities.RemoveRange(oldUserStatEntities);
        }

        // Favorite Games by # of times played
        var faveGamesByFreq = userMatchPlayers.GroupBy(p => p.Match.Game).OrderByDescending(g => g.Count()).Take(3);
        int rankIndex = 1;
        foreach (var group in faveGamesByFreq)
        {
          this.context.UserStatEntities.Add(new UserStatEntity
          {
            UserStatId = userStat.UserStatId,
            GameEntityId = group.Key.GameId,
            Rank = rankIndex,
            IsFavoriteGame = true
          });
          rankIndex++;
        }

        // Most Won Game
        var mostWonGames = userMatchPlayers.Where(p => p.Winner).GroupBy(p => p.Match.Game).OrderByDescending(g => g.Count()).Take(3);
        rankIndex = 1;
        foreach (var group in mostWonGames)
        {
          this.context.UserStatEntities.Add(new UserStatEntity
          {
            UserStatId = userStat.UserStatId,
            GameEntityId = group.Key.GameId,
            Rank = rankIndex,
            IsMostWonGame = true
          });
          rankIndex++;
        }

        // Any First Timer Wins
        var firstTimerWins = userMatchPlayers.Where(p => p.FirstTimer && p.Winner).GroupBy(p => p.Match.Game).OrderByDescending(g => g.Count()).Take(3);
        foreach (var group in firstTimerWins)
        {
          this.context.UserStatEntities.Add(new UserStatEntity
          {
            UserStatId = userStat.UserStatId,
            GameEntityId = group.Key.GameId,
            Rank = rankIndex,
            IsFirstTimerWinGame = true
          });
        }

        _logger.LogInformation(LoggingEvents.GetUser, "Ending CalculateUserStats {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetFailed, ex, "CalculateUserStats ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void Save()
    {
      try
      {
        context.SaveChanges();
        _logger.LogInformation(LoggingEvents.Save, "Save successful at {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.SaveError, ex, "Saving ERROR at {timestamp}", DateTime.Now);
      }
    }

    private bool disposed = false;

    protected virtual void Dispose(bool disposing)
    {
      if (!this.disposed)
      {
        if (disposing)
        {
          context.Dispose();
        }
      }
      this.disposed = true;
    }

    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(this);
    }
  }
}
