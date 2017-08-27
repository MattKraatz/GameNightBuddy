using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Constants;
using Microsoft.Extensions.Logging;

namespace GameNightBuddy_Server.Repositories
{
  public interface IGameNightRepository : IDisposable
  {
    IEnumerable<GameNight> GetGameNights();
    IEnumerable<GameNight> GetMyGameNights(Guid userId);
    IEnumerable<GameNight> GetOtherGameNights(Guid userId);
    GameNightViewModel LoadGameNightByID(Guid nightId, Guid userId);
    Guid InsertGameNight(GameNight night);
    GameNightGame InsertGameNightGame(Guid gameId, Guid nightId);
    GameNightMember InsertMember(GameNightMember member);
    void DeactivateMember(Guid memberId);
    GameNightMember GetMember(Guid id);
    void UpdateMember(GameNightMember member);
    Match InsertMatch(MatchViewModel vm, Guid nightId);
    Match UpdateMatch(MatchViewModel vm);
    void DeactivateGameNight(Guid nightId);
    void UpdateGameNight(GameNight night);
    void Save();
  }

  public class GameNightRepository : IGameNightRepository, IDisposable
  {
    private Context context;
    private readonly ILogger _logger;

    public GameNightRepository(Context context, ILogger<GameNightRepository> logger)
    {
      this.context = context;
      this._logger = logger;
    }

    public IEnumerable<GameNight> GetGameNights()
    {
      _logger.LogInformation(LoggingEvents.GetAllGameNights, "Starting GetGameNights {timestamp}", DateTime.Now);

      try
      {
        var gameNights = context.GameNights.Where(n => n.IsActive).ToList();

        _logger.LogInformation(LoggingEvents.GetAllGameNights, "Ending GetGameNights {timestamp}", DateTime.Now);
        return gameNights;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetOtherGameNights, ex, "GetOtherGameNights ERROR at {timestamp}", DateTime.Now);
        return new List<GameNight>();
      }
    }

    public IEnumerable<GameNight> GetOtherGameNights(Guid userId)
    {
      // handle null values
      if (userId == Guid.Empty) return new List<GameNight>();
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "Starting GetOtherGameNights {timestamp}", DateTime.Now);

      try
      {
        var nights = context.GameNightMembers.Where(m => m.UserId == userId).Select(m => m.GameNightId);
        var output = context.GameNights.Where(n => !nights.Contains(n.GameNightId) && n.IsActive).ToList();

        _logger.LogInformation(LoggingEvents.GetOtherGameNights, "Ending GetOtherGameNights {timestamp}", DateTime.Now);
        return output;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetOtherGameNights, ex, "GetOtherGameNights ERROR at {timestamp}", DateTime.Now);
        return new List<GameNight>();
      }
    }


    public IEnumerable<GameNight> GetMyGameNights(Guid userId)
    {
      // handle null values
      if (userId == Guid.Empty) return new List<GameNight>();
      _logger.LogInformation(LoggingEvents.GetMyGameNights, "Starting GetMyGameNights {timestamp}", DateTime.Now);

      try
      {
        var nights = context.GameNightMembers.Where(m => m.UserId == userId && m.IsActive).Select(m => m.GameNightId);
        var output = context.GameNights.Where(n => nights.Contains(n.GameNightId) && n.IsActive)
            .Include(n => n.Members)
              .ThenInclude(m => m.User)
            .ToList();

        _logger.LogInformation(LoggingEvents.GetMyGameNights, "Ending GetMyGameNights {timestamp}", DateTime.Now);
        return output;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetMyGameNights, ex, "GetMyGameNights ERROR at {timestamp}", DateTime.Now);
        return new List<GameNight>();
      }
    }

    public GameNightViewModel LoadGameNightByID(Guid nightId, Guid userId)
    {
      // handle null values
      if (nightId == Guid.Empty || userId == Guid.Empty) return new GameNightViewModel();
      _logger.LogInformation(LoggingEvents.GetGameNightById, "Starting LoadGameNightByID {timestamp}", DateTime.Now);

      try
      {
        var night = context.GameNights.FirstOrDefault(n => n.GameNightId == nightId);
        // Full Member Tree
        night.Members = context.GameNightMembers
          .Include(m => m.User)
          .Where(m => m.GameNightId == night.GameNightId && m.IsActive).ToList();
        // Full Match Tree
        night.Matches = context.Matches
          .Include(m => m.Players)
            .ThenInclude(p => p.Member)
              .ThenInclude(m => m.User)
          .Include(m => m.Game)
            .ThenInclude(g => g.User)
          .Where(m => m.GameNightId == night.GameNightId)
          .Where(m => m.IsActive).ToList();
        // Full Game Tree
        night.Games = context.GameNightGames
          .Include(gng => gng.Game)
            .ThenInclude(g => g.User)
          .Include(gng => gng.Game)
            .ThenInclude(g => g.GameRatings)
          .Where(g => g.GameNightId == nightId && g.IsActive && g.Game.IsActive)
          .ToList();

        // only provide ratings from group members
        night.Games.ForEach(g =>
        {
          g.Game.GameRatings = g.Game.GameRatings
              .Where(r => night.Members.FindIndex(m => m.UserId == r.UserId) > -1).ToList();
        });

        var vm = new GameNightViewModel(night, userId);
        vm.Games.ForEach(g =>
        {
          var myRating = night.Games
            .First(gm => gm.GameId.ToString() == g.GameId)
            .Game.GameRatings.FirstOrDefault(r => r.UserId == userId);

          g.MyRating = myRating != null ? myRating.Rating : 0;
        });

        _logger.LogInformation(LoggingEvents.GetGameNightById, "Ending LoadGameNightByID {timestamp}", DateTime.Now);
        return vm;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetGameNightById, ex, "LoadGameNightByID ERROR at {timestamp}", DateTime.Now);
        return new GameNightViewModel();
      }
    }

    public Match InsertMatch(MatchViewModel vm, Guid nightId)
    {
      // handle null values
      if (vm == null || nightId == Guid.Empty) return new Match();
      _logger.LogInformation(LoggingEvents.AddMatch, "Starting InsertMatch {timestamp}", DateTime.Now);

      try
      {
        var match = new Match(vm)
        {
          GameNightId = nightId
        };
        context.Matches.Add(match);
        foreach (PlayerViewModel pvm in vm.Players)
        {
          var player = new MatchPlayer(pvm)
          {
            MatchId = match.MatchId
          };
          context.MatchPlayers.Add(player);

        }

        _logger.LogInformation(LoggingEvents.AddMatch, "Ending InsertMatch {timestamp}", DateTime.Now);
        return match;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.AddMatch, ex, "InsertMatch ERROR at {timestamp}", DateTime.Now);
        return new Match();
      }
    }

    public Match UpdateMatch(MatchViewModel vm)
    {
      // handle null values
      if (vm == null) return new Match();
      _logger.LogInformation(LoggingEvents.UpdateMatch, "Starting UpdateMatch {timestamp}", DateTime.Now);

      try
      {
        var update = new Match(vm);

        // update match properties
        var match = context.Matches.FirstOrDefault(m => m.MatchId == new Guid(vm.MatchId));
        match.GameId = update.GameId;
        match.Date = update.Date;

        var players = context.MatchPlayers.Where(mp => mp.MatchId == match.MatchId).ToList();

        // remove any players as needed
        var deletedPlayers = players.Where(p => vm.Players.FindIndex(u => u.MemberId == p.GameNightMemberId.ToString()) < 0);
        context.MatchPlayers.RemoveRange(deletedPlayers);
        players = players.Where(p => !deletedPlayers.Contains(p)).ToList();

        // edit any existing players
        players.ForEach(p =>
        {
          var player = vm.Players.FirstOrDefault(up => up.MemberId == p.GameNightMemberId.ToString());
          p.FirstTimer = player.FirstTime;
          p.Score = player.Score;
          p.Team = player.Team;
          p.Winner = player.Winner;
        });

        // add any new players
        var newPlayers = vm.Players.Where(vmp => players.FindIndex(p => p.GameNightMemberId.ToString() == vmp.MemberId) < 0).ToList();
        newPlayers.ForEach(p =>
        {
          var player = new MatchPlayer(p)
          {
            MatchId = match.MatchId
          };
          context.MatchPlayers.Add(player);
        });

        _logger.LogInformation(LoggingEvents.UpdateMatch, "Ending UpdateMatch {timestamp}", DateTime.Now);
        return match;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateMatch, ex, "UpdateMatch ERROR at {timestamp}", DateTime.Now);
        return new Match();
      }
    }

    public GameNightMember InsertMember(GameNightMember member)
    {
      // handle null values
      if (member == null) return new GameNightMember();
      _logger.LogInformation(LoggingEvents.AddMember, "Starting InsertMember {timestamp}", DateTime.Now);

      try
      {
        // check for existing game night member and re-activate instead
        var dbMember = context.GameNightMembers.Include(m => m.User).FirstOrDefault(m => m.UserId == member.UserId && m.GameNightId == member.GameNightId);
        if (dbMember != null)
        {
          dbMember.IsActive = true;
          _logger.LogInformation(LoggingEvents.AddMember, "Ending InsertMember, Reactivated Existing Member {memberId} {timestamp}", dbMember.GameNightMemberId, DateTime.Now);
          return dbMember;
        }

        context.GameNightMembers.Add(member);
        member.User = context.Users.FirstOrDefault(u => u.UserId == member.UserId);

        _logger.LogInformation(LoggingEvents.AddMember, "Ending InsertMember {timestamp}", DateTime.Now);
        return member;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.AddMember, ex, "InsertMember ERROR at {timestamp}", DateTime.Now);
        return new GameNightMember();
      }
    }

    public void UpdateMember(GameNightMember member)
    {
      // handle null values
      if (member == null) return;
      _logger.LogInformation(LoggingEvents.UpdateMember, "Starting UpdateMember {timestamp}", DateTime.Now);

      try
      {
        context.Entry(member).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.UpdateMember, "Ending UpdateMember {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateMember, ex, "UpdateMember ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void DeactivateMember(Guid memberId)
    {
      // handle null values
      if (memberId == null) return;
      _logger.LogInformation(LoggingEvents.UpdateMember, "Starting DeactivateMember {timestamp}", DateTime.Now);

      try
      {
        var member = context.GameNightMembers.FirstOrDefault(m => m.GameNightMemberId == memberId);
        member.IsActive = false;
        context.Entry(member).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.UpdateMember, "Ending DeactivateMember {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateMember, ex, "DeactivateMember ERROR at {timestamp}", DateTime.Now);
      }
    }

    public GameNightMember GetMember(Guid id)
    {
      // handle null values
      if (id == Guid.Empty) return new GameNightMember();
      _logger.LogInformation(LoggingEvents.GetMember, "Starting GetMember {timestamp}", DateTime.Now);

      try
      {
        var member = context.GameNightMembers.FirstOrDefault(m => m.GameNightMemberId == id);

        _logger.LogInformation(LoggingEvents.GetMember, "Ending GetMember {timestamp}", DateTime.Now);
        return member;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.GetMember, ex, "GetMember ERROR at {timestamp}", DateTime.Now);
        return new GameNightMember();
      }
    }

    public GameNightGame InsertGameNightGame(Guid gameId, Guid nightId)
    {
      // handle null values
      if (gameId == Guid.Empty || nightId == Guid.Empty) return new GameNightGame();
      _logger.LogInformation(LoggingEvents.AddGameToGameNight, "Starting InsertGameNightGame {timestamp}", DateTime.Now);

      try
      {
        // Make sure this game doesn't already exist in the collection
        var game = context.GameNightGames.FirstOrDefault(g => g.GameNightId == nightId && g.GameId == gameId);
        if (game != null) return game;

        game = new GameNightGame { GameId = gameId, GameNightId = nightId };
        context.GameNightGames.Add(game);

        game.Game = context.Games
          .Include(g => g.User)
          .FirstOrDefault(g => g.GameId == game.GameId);

        _logger.LogInformation(LoggingEvents.AddGameToGameNight, "Starting InsertGameNightGame {timestamp}", DateTime.Now);
        return game;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.AddGameToGameNight, ex, "InsertGameNightGame ERROR at {timestamp}", DateTime.Now);
        return new GameNightGame();
      }
    }

    public Guid InsertGameNight(GameNight night)
    {
      // handle null values
      if (night == null) return Guid.Empty;
      _logger.LogInformation(LoggingEvents.CreateGameNight, "Starting InsertGameNight {timestamp}", DateTime.Now);

      try
      {
        context.GameNights.Add(night);

        _logger.LogInformation(LoggingEvents.CreateGameNight, "Ending InsertGameNight {timestamp}", DateTime.Now);
        return night.GameNightId;
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.CreateGameNight, ex, "InsertGameNight ERROR at {timestamp}", DateTime.Now);
        return Guid.Empty;
      }
    }

    public void DeactivateGameNight(Guid nightId)
    {
      // handle null values
      if (nightId == Guid.Empty) return;
      _logger.LogInformation(LoggingEvents.DeactiveGameNight, "Starting DeactiveGameNight {timestamp}", DateTime.Now);

      try
      {
        var night = context.GameNights.SingleOrDefault(n => n.GameNightId == nightId);
        night.IsActive = false;
        context.Entry(night).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.DeactiveGameNight, "Ending DeactiveGameNight {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.DeactiveGameNight, ex, "DeactiveGameNight ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void UpdateGameNight(GameNight night)
    {
      // handle null values
      if (night == null) return;
      _logger.LogInformation(LoggingEvents.UpdateGameNight, "Starting UpdateGameNight {timestamp}", DateTime.Now);

      try
      {
        context.Entry(night).State = EntityState.Modified;
        _logger.LogInformation(LoggingEvents.UpdateGameNight, "Ending UpdateGameNight {timestamp}", DateTime.Now);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.UpdateGameNight, ex, "UpdateGameNight ERROR at {timestamp}", DateTime.Now);
      }
    }

    public void Save()
    {
      try
      {
        context.SaveChanges();
        _logger.LogInformation(LoggingEvents.Save, "Save successful at {timestamp}", DateTime.Now);
      }
      catch(Exception ex)
      {
        _logger.LogError(LoggingEvents.SaveError, ex, "Saving ERROR at {timestamp}", DateTime.Now);
      }
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
