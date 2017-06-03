﻿using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

    public UserRepository(Context context)
    {
      this.context = context;
    }

    public User GetUserByFbKey(string id)
    {
      return this.context.Users
        .Include(u => u.Games)
          .ThenInclude(g => g.User)
        .FirstOrDefault(u => u.FirebaseId == id);
    }

    public List<User> QueryUsers(string query, Guid nightId)
    {
      var memberIds = this.context.GameNightMembers.Where(m => m.GameNightId == nightId).Select(m => m.UserId).ToList();
      query = query.ToLower();
      return this.context.Users.Where(u => 
        !memberIds.Contains(u.UserId) &&  
          (
            (u.DisplayName != null && u.DisplayName.ToLower().Contains(query)) ||
            string.Concat(u.FirstName + u.LastName).ToLower().Contains(query))
           ).ToList();
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
      this.context.Users.Add(user);
      return user.UserId;
    }

    public void UpdateUser(User user)
    {
      var dbUser = this.context.Users.First(u => u.UserId == user.UserId);
      dbUser.FirstName = user.FirstName;
      dbUser.LastName = user.LastName;
      dbUser.Email = user.Email;
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
