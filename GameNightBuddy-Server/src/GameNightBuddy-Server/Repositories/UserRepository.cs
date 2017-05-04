using GameNightBuddy_Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Repositories
{
  public interface IUserRepository : IDisposable
  {
    User GetUserByFbKey(string id);
    List<User> QueryUsers(string query);
    User GetUser(Guid id);
    Guid InsertUser(User user);
    void DeactivateUser(Guid userId);
    void UpdateUser(User user);
    void Save();
  }

  public class UserRepository : IUserRepository
  {
    private Context context;

    public UserRepository(Context context)
    {
      this.context = context;
    }

    public User GetUserByFbKey(string id)
    {
      return this.context.Users.FirstOrDefault(u => u.FirebaseId == id);
    }

    public List<User> QueryUsers(string query)
    {
      return this.context.Users.Where(u => u.DisplayName.Contains(query) || string.Concat(u.FirstName + u.LastName).Contains(query)).ToList();
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
      throw new NotImplementedException();
    }

    public void UpdateUser(User user)
    {
      var dbUser = this.context.Users.First(u => u.UserId == user.UserId);
      dbUser.FirstName = user.FirstName;
      dbUser.LastName = user.LastName;
      dbUser.DisplayName = user.DisplayName;
      dbUser.PhotoURL = user.PhotoURL;
    }

    public void Save()
    {
      context.SaveChanges();
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
