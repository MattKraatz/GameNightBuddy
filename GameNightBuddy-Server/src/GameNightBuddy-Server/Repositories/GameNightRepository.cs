using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Repositories
{
  public interface IGameNightRepository : IDisposable
  {
    IEnumerable<GameNight> GetGameNights();
    GameNight LoadGameNightByID(Guid nightId);
    Guid InsertGameNight(GameNight night);
    void DeactivateGameNight(Guid nightId);
    void UpdateGameNight(GameNight night);
    void Save();
  }

  public class GameNightRepository : IGameNightRepository, IDisposable
  {
    private Context context;
      
    public GameNightRepository(Context context)
    {
      this.context = context;
    }

    public IEnumerable<GameNight> GetGameNights()
    {
      return context.GameNights.ToList();
    }

    public GameNight LoadGameNightByID(Guid nightId)
    {
      return context.GameNights.SingleOrDefault(n => n.GameNightId == nightId);
    }

    public Guid InsertGameNight(GameNight night)
    {
      context.GameNights.Add(night);
      return night.GameNightId;
    }

    public void DeactivateGameNight(Guid nightId)
    {
      var night = context.GameNights.SingleOrDefault(n => n.GameNightId == nightId);
      night.IsActive = false;
      context.Entry(night).State = EntityState.Modified;
    }

    public void UpdateGameNight(GameNight night)
    {
      context.Entry(night).State = EntityState.Modified;
    }

    public async void Save()
    {
      await context.SaveChangesAsync();
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
