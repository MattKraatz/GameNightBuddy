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
    GameNightGame InsertGameNightGame(Guid gameId, Guid nightId);
    GameNightMember InsertMember(GameNightMember member);
    Match InsertMatch(MatchViewModel vm, Guid nightId);
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

    public Match InsertMatch(MatchViewModel vm, Guid nightId)
    {
      var match = new Match(vm);
      match.GameNightId = nightId;
      context.Matches.Add(match);
      foreach (PlayerViewModel pvm in vm.Players)
      {
        var player = new MatchPlayer(pvm);
        player.MatchId = match.MatchId;
        context.MatchPlayers.Add(player);
      }
      return match;
    }

    public GameNightMember InsertMember(GameNightMember member)
    {
      context.GameNightMembers.Add(member);
      member.User = context.Users.FirstOrDefault(u => u.UserId == member.UserId);
      return member;
    }

    public GameNightGame InsertGameNightGame(Guid gameId, Guid nightId)
    {
      var game = new GameNightGame { GameId = gameId, GameNightId = nightId };
      context.GameNightGames.Add(game);

      game.Game = context.Games
        .Include(g => g.User)
        .FirstOrDefault(g => g.GameId == game.GameId);

      return game;
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
