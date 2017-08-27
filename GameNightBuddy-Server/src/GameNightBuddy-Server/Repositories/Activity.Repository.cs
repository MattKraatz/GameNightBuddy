using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using GameNightBuddy_Server.Constants;
using Microsoft.Extensions.Logging;

namespace GameNightBuddy_Server.Repositories
{
  public interface IActivityRepository : IDisposable
  {
    Activity CreateActivity(Activity model);
    List<Activity> GetActivitiesByGameNightId(Guid nightId);
    void Save();
  }

  public class ActivityRepository : IActivityRepository
  {
    private Context context;
    private readonly ILogger _logger;

    public ActivityRepository(Context context, ILogger<ActivityRepository> logger)
    {
      this.context = context;
      this._logger = logger;
    }

    public Activity CreateActivity(Activity model)
    {
      if (model == null) return new Activity();
      _logger.LogInformation(LoggingEvents.CreateActivity, "Starting CreateActivity {timestamp}", DateTime.Now);

      try
      {
        this.context.Activities.Add(model);

        _logger.LogInformation(LoggingEvents.CreateActivity, "Ending CreateActivity {timestamp}", DateTime.Now);
        return model;
      }
      catch(Exception ex)
      {
        _logger.LogError(LoggingEvents.CreateActivity, ex, "CreateActivity ERROR at {timestamp}", DateTime.Now);
        return new Activity();
      }
    }

    public List<Activity> GetActivitiesByGameNightId(Guid nightId)
    {
      var games = this.context.GameNightGames.Where(g => g.GameNightId == nightId && g.IsActive).ToList();
      return this.context.Activities.Where(a => a.GameNightId == nightId ||
          (a.EntityType == Activities.Entities.GAME && games.FindIndex(g => g.GameId == a.EntityId) > -1))
          .OrderByDescending(a => a.DateCreated)
          .ToList();
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
