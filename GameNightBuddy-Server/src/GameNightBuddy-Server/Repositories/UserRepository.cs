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
    User GetUserByFbKey(string id);
    List<User> QueryUsers(string query, Guid nightId);
    User GetUser(Guid id);
    Guid InsertUser(User user);
    void DeactivateUser(Guid userId);
    void UpdateUser(User user);
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

    public User GetUserByFbKey(string id)
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

    public List<User> QueryUsers(string query, Guid nightId)
    {
      if (query?.Length < 1 || nightId == Guid.Empty) return new List<User>();
      _logger.LogInformation(LoggingEvents.QueryUsers, "Starting QueryUsers {timestamp}", DateTime.Now);

      try
      {
        var memberIds = this.context.GameNightMembers.Where(m => m.GameNightId == nightId).Select(m => m.UserId).ToList();
        query = query.ToLower();
        var users = this.context.Users.Where(u =>
          !memberIds.Contains(u.UserId) &&
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

    public void UpdateUser(User user)
    {
      if (user == null) return;
      _logger.LogInformation(LoggingEvents.UpdateUser, "Starting UpdateUser {timestamp}", DateTime.Now);

      try
      {
        var dbUser = this.context.Users.First(u => u.UserId == user.UserId);
        dbUser.FirstName = user.FirstName;
        dbUser.LastName = user.LastName;
        dbUser.Email = user.Email;
        dbUser.DisplayName = user.DisplayName;
        dbUser.PhotoURL = user.PhotoURL;
        _logger.LogInformation(LoggingEvents.UpdateUser, "Ending UpdateUser {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateUser, ex, "UpdateUser ERROR at {timestamp}", DateTime.Now);
        return;
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
