using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GameNightBuddy_Server.Repositories
{
  public interface IGameRepository : IDisposable
  {
    IEnumerable<Game> GetGames();
    IEnumerable<Game> GetMyGames(Guid id);
    Guid InsertGame(Game game);
    void DeactivateGame(Guid gameId);
    void UpdateGame(Game game);
    void UpdateRating(GameRating rating);
    void DeleteRating(GameRatingViewModel rating);
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
      var games = context.Games.Where(g => g.UserId == id)
          .Include(g => g.User)
          .Include(g => g.GameRatings);   

      // only show ratings from owner
      foreach(Game game in games)
      {
        game.GameRatings = game.GameRatings.Where(r => r.UserId == game.UserId).ToList();
      }

      return games;
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

    public void UpdateRating(GameRating rating)
    {
      var dbRating = context.GameRatings.FirstOrDefault(r => r.GameId == rating.GameId && r.UserId == rating.UserId);
      if (dbRating != null)
      {
        dbRating.Rating = rating.Rating;
        context.Entry(dbRating).State = EntityState.Modified;
      } else
      {
        context.GameRatings.Add(rating);
      }
    }

    public void DeleteRating(GameRatingViewModel vm)
    {
      throw new NotImplementedException();
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
