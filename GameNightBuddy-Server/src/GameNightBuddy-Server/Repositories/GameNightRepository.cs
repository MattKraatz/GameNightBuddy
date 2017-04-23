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
    IEnumerable<GameNight> GetMyGameNights(Guid id);
    GameNight LoadGameNightByID(Guid nightId);
    Guid InsertGameNight(GameNight night);
    Guid InsertGameNightGame(Guid gameId, Guid nightId);
    Guid InsertMember(GameNightMember member, Guid id);
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

    public IEnumerable<GameNight> GetMyGameNights(Guid id)
    {
      var nights = context.GameNightMembers.Where(m => m.UserId == id).Select(m => m.GameNightId);
      return context.GameNights.Where(n => nights.Contains(n.GameNightId))
          .Include(n => n.Members)
            .ThenInclude(m => m.User)
          .ToList();
    }

    public GameNight LoadGameNightByID(Guid nightId)
    {
      return context.GameNights
        // Full Member Tree
        .Include(n => n.Members)
          .ThenInclude(m => m.User)
        // Full Match Tree
        .Include(n => n.Matches)
          .ThenInclude(m => m.Players)
            .ThenInclude(p => p.Member)
              .ThenInclude(m => m.User)
        .Include(n => n.Matches)
          .ThenInclude(m => m.Game)
            .ThenInclude(g => g.User)
        // Full Games Tree
        .Include(n => n.Games)
          .ThenInclude(g => g.Game)
            .ThenInclude(g => g.User)
        .SingleOrDefault(n => n.GameNightId == nightId);
    }

    public Guid InsertMember(GameNightMember member, Guid nightId)
    {
      context.GameNights.SingleOrDefault(n => n.GameNightId == nightId).Members.Add(member);
      return member.GameNightMemberId;
    }

    public Guid InsertGameNightGame(Guid gameId, Guid nightId)
    {
      var game = new GameNightGame { GameId = gameId, GameNightId = nightId };
      context.GameNightGames.Add(game);
      return game.GameNightGameId;
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
