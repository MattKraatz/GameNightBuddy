using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using GameNightBuddy_Server.Constants;

namespace GameNightBuddy_Server.Repositories
{
  public interface IActivityRepository : IDisposable
  {
    Models.Activity CreateActivity(Models.Activity model);
    List<Models.Activity> GetActivitiesByGameNightId(Guid nightId);
    void Save();
  }

  public class ActivityRepository : IActivityRepository
  {
    private Context context;

    public ActivityRepository(Context context)
    {
      this.context = context;
    }

    public Models.Activity CreateActivity(Models.Activity model)
    {
      this.context.Activities.Add(model);
      return model;
    }

    public List<Models.Activity> GetActivitiesByGameNightId(Guid nightId)
    {
      var games = this.context.GameNightGames.Where(g => g.GameNightId == nightId).ToList();
      return this.context.Activities.Where(a => a.GameNightId == nightId ||
          (a.EntityType == Constants.Activity.Entities.GAME && games.FindIndex(g => g.GameId == a.EntityId) > -1))
          .ToList();
    }

    public void Save()
    {
      context.SaveChanges();
    }

    // IDisposable Implementation
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
