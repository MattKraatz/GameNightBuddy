using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using GameNightBuddy_Server.Constants;

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
    List<Game> GetGameRecommendations(GameRecRequestViewModel request, Guid requestingUserId);
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
      foreach (Game game in games)
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
      }
      else
      {
        context.GameRatings.Add(rating);
      }
    }

    public void DeleteRating(GameRatingViewModel vm)
    {
      throw new NotImplementedException();
    }

    public List<Game> GetGameRecommendations(GameRecRequestViewModel request, Guid requestingUserId)
    {
      List<Game> games = null;
      int playerCount = request.UserIds.Count;
      bool requesterIsInParty = request.UserIds.Contains(requestingUserId);

      var gameNightGameIds = context.GameNightGames
            .Where(gng => gng.GameNightId == request.GameNightId)
            .Select(gng => gng.GameId).ToList();

      if (gameNightGameIds.Count > 0)
      {
        // Get games from the member's game night, include ratings
        games = context.Games
            .Include(g => g.User)
            // only evaluate games that can handle the number of players
            .Where(g => g.MaxPlayers >= playerCount && g.MinPlayers <= playerCount)
            .Where(g => gameNightGameIds.FindIndex(id => g.GameId == id) > -1)
            .ToList();
      }

      if (games != null)
      {
        foreach (Game game in games)
        {
          // Grab game ratings for each game, party user
          game.GameRatings = context.GameRatings
                        .Where(r => r.GameId == game.GameId && request.UserIds.Contains(r.UserId))
                        .ToList();
          // if any members haven't rated the game yet, add temp ratings
          for(var i = game.GameRatings.Count; i < playerCount; i++)
          {
            game.GameRatings.Add(new GameRating { Rating = 0 });
          }
        }
        // order games by average rating 
        var output = games.OrderByDescending(g => g.GameRatings.Sum(r => r.Rating != 0 ? r.Rating : 3))
                        .Take(3)
                        .ToList();
        // grab the requester's rating if they aren't in the party
        if (!requesterIsInParty)
        {
          output.ForEach(g =>
          {
            var requesterGameRating = context.GameRatings
                        .FirstOrDefault(r => r.UserId == requestingUserId && r.GameId == g.GameId);
            if (requesterGameRating != null)
            {
              g.GameRatings.Add(requesterGameRating);
            }
          });
        }
        return output;
      }
      else
      {
        return new List<Game>();
      }

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
