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
  public interface IGameRepository : IDisposable
  {
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
    private readonly ILogger _logger;

    public GameRepository(Context context, ILogger<GameRepository> logger)
    {
      this.context = context;
      this._logger = logger;
    }

    public void DeactivateGame(Guid gameId)
    {
      if (gameId == Guid.Empty) return;
      _logger.LogInformation(LoggingEvents.DeactivateGame, "Starting DeactivateGame {timestamp}", DateTime.Now);

      try
      {
        var game = context.Games.SingleOrDefault(n => n.GameId == gameId);
        game.IsActive = false;
        context.Entry(game).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.DeactivateGame, "Ending DeactivateGame {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetFailed, ex, "DeactivateGame ERROR at {timestamp}", DateTime.Now);
      }
    }

    public IEnumerable<Game> GetMyGames(Guid id)
    {
      // handle null values
      if (id == Guid.Empty) return new List<Game>();
      _logger.LogInformation(LoggingEvents.GetMyGames, "Starting GetMyGames {timestamp}", DateTime.Now);

      try
      {
        var games = context.Games.Where(g => g.UserId == id)
            .Include(g => g.User)
            .Include(g => g.GameRatings);

        // only show ratings from owner
        foreach (Game game in games)
        {
          game.GameRatings = game.GameRatings.Where(r => r.UserId == game.UserId).ToList();
        }

        _logger.LogInformation(LoggingEvents.GetMyGames, "Ending GetMyGames {timestamp}", DateTime.Now);
        return games;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetMyGames, ex, "GetMyGames ERROR at {timestamp}", DateTime.Now);
        return new List<Game>();
      }
    }

    public Guid InsertGame(Game game)
    {
      // handle null values
      if (game == null) return Guid.Empty;
      _logger.LogInformation(LoggingEvents.CreateGame, "Starting InsertGame {timestamp}", DateTime.Now);

      try
      {
        context.Games.Add(game);

        _logger.LogInformation(LoggingEvents.CreateGame, "Ending InsertGame {timestamp}", DateTime.Now);
        return game.GameId;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.CreateGameNight, ex, "InsertGameNight ERROR at {timestamp}", DateTime.Now);
        return Guid.Empty;
      }
    }

    public Guid InsertGameAndGameNightGame(Game game, Guid nightId)
    {
      // handle null values
      if (game == null || nightId == Guid.Empty) return Guid.Empty;
      _logger.LogInformation(LoggingEvents.CreateGameAndAddToGameNight, "Starting InsertGameAndGameNightGame {timestamp}", DateTime.Now);

      try
      {
        context.Games.Add(game);
        var gng = new GameNightGame { GameId = game.GameId, GameNightId = nightId };
        context.GameNightGames.Add(gng);

        _logger.LogInformation(LoggingEvents.CreateGameAndAddToGameNight, "Ending InsertGameAndGameNightGame {timestamp}", DateTime.Now);
        return gng.GameNightGameId;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.CreateGameAndAddToGameNight, ex, "InsertGameAndGameNightGame ERROR at {timestamp}", DateTime.Now);
        return Guid.Empty;
      }
    }

    public void UpdateGame(Game game)
    {
      if (game == null) return;
      _logger.LogInformation(LoggingEvents.UpdateGame, "Starting UpdateGame {timestamp}", DateTime.Now);

      try
      {
        context.Entry(game).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.UpdateGame, "Ending UpdateGame {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateGame, ex, "UpdateGame ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void UpdateRating(GameRating rating)
    {
      if (rating == null) return;
      _logger.LogInformation(LoggingEvents.UpdateGameRating, "Starting UpdateRating {timestamp}", DateTime.Now);

      try
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

        _logger.LogInformation(LoggingEvents.UpdateGameRating, "Ending UpdateRating {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateGameRating, ex, "UpdateRating ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void DeleteRating(GameRatingViewModel vm)
    {
      throw new NotImplementedException();
    }

    public List<Game> GetGameRecommendations(GameRecRequestViewModel request, Guid requestingUserId)
    {
      if (request == null || requestingUserId == Guid.Empty) return new List<Game>();
      _logger.LogInformation(LoggingEvents.GetGameRecommendation, "Starting GetGameRecommendations {timestamp}", DateTime.Now);

      try
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

        if (games == null)
        {
          _logger.LogWarning(LoggingEvents.GetGameRecommendation, "Ending GetGameRecommendations {timestamp}", DateTime.Now);
          return new List<Game>();
        }

        foreach (Game game in games)
        {
          // Grab game ratings for each game, party user
          game.GameRatings = context.GameRatings
                        .Where(r => r.GameId == game.GameId && request.UserIds.Contains(r.UserId))
                        .ToList();
          // if any members haven't rated the game yet, add temp ratings
          for (var i = game.GameRatings.Count; i < playerCount; i++)
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

        _logger.LogInformation(LoggingEvents.GetGameRecommendation, "Ending GetGameRecommendations {timestamp}", DateTime.Now);
        return output;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetGameRecommendation, ex, "GetGameRecommendations ERROR at {timestamp}", DateTime.Now);
        return new List<Game>();
      }
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
