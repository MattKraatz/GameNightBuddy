using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
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
    IEnumerable<GameNight> GetMyGameNights(Guid userId);
    IEnumerable<GameNight> GetOtherGameNights(Guid userId);
    GameNightViewModel LoadGameNightByID(Guid nightId);
    Guid InsertGameNight(GameNight night);
    Guid InsertGameNightGame(Guid gameId, Guid nightId);
    Guid InsertMember(GameNightMember member);
    Guid InsertMatch(Guid nightId, MatchViewModel match);
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

    public IEnumerable<GameNight> GetOtherGameNights(Guid userId)
    {
      var nights = context.GameNightMembers.Where(m => m.UserId == userId).Select(m => m.GameNightId);
      return context.GameNights.Where(n => !nights.Contains(n.GameNightId)).ToList();
    }


    public IEnumerable<GameNight> GetMyGameNights(Guid userId)
    {
      var nights = context.GameNightMembers.Where(m => m.UserId == userId).Select(m => m.GameNightId);
      return context.GameNights.Where(n => nights.Contains(n.GameNightId))
          .Include(n => n.Members)
            .ThenInclude(m => m.User)
          .ToList();
    }

    public GameNightViewModel LoadGameNightByID(Guid nightId)
    {
      var night = context.GameNights
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
        .FirstOrDefault(n => n.GameNightId == nightId);

      night.Games = context.GameNightGames
        .Include(gng => gng.Game)
          .ThenInclude(g => g.User)
        .Where(g => g.GameNightId == nightId)
        .ToList();

      var vm = new GameNightViewModel(night);
      
      return vm;
    }

    public Guid InsertMatch(Guid nightId, MatchViewModel vm)
    {
      var match = new Match(vm);
      match.GameNightId = nightId;
      context.Matches.Add(match);
      foreach (PlayerViewModel pvm in vm.Players)
      {
        var player = new MatchPlayer(pvm);
        player.MatchId = match.MatchId;
        // TODO: update the GameNight VM to eliminate the need for this MemberId call
        player.GameNightMemberId = context.GameNightMembers.First(m => m.UserId == pvm.UserId).GameNightMemberId;
        context.MatchPlayers.Add(player);
      }
      return match.MatchId;
    }

    public Guid InsertMember(GameNightMember member)
    {
      context.GameNightMembers.Add(member);
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
