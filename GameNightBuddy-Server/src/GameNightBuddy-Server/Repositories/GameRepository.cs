using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Repositories
{
  public interface IGameRepository : IDisposable
  {
    IEnumerable<Game> GetGames();
    IEnumerable<Game> GetMyGames(Guid id);
    Guid InsertGame(Game game);
    void DeactivateGame(Guid gameId);
    void UpdateGame(Game game);
    void Save();
  }

  public class GameRepository : IGameRepository
  {
    private Context context;

    public GameRepository(Context context)
    {
      this.context = context;
    }

    public void DeactivateGame(Guid gameId)
    {
      var game = context.Games.SingleOrDefault(n => n.GameId == gameId);
      game.IsActive = false;
      context.Entry(game).State = EntityState.Modified;
    }

    public IEnumerable<Game> GetGames()
    {
      return context.Games.ToList();
    }

    public IEnumerable<Game> GetMyGames(Guid id)
    {
      return context.Games.Where(g => g.UserId == id)
          .Include(g => g.User);
    }

    public Guid InsertGame(Game game)
    {
      context.Games.Add(game);
      return game.GameId;
    }

    public Guid InsertGameAndGameNightGame(Game game, Guid nightId)
    {
      context.Games.Add(game);
      var gng = new GameNightGame { GameId = game.GameId, GameNightId = nightId };
      context.GameNightGames.Add(gng);
      return gng.GameNightGameId;
    }

    public void UpdateGame(Game game)
    {
      context.Entry(game).State = EntityState.Modified;
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
