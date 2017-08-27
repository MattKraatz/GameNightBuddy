using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Constants;

namespace GameNightBuddy_Server.Repositories
{
  public interface IMatchRepository : IDisposable
  {
    IEnumerable<Match> GetMatches();
    IEnumerable<Match> GetMyMatches(Guid id);
    Match InsertMatch(Match match);
    Match GetMatch(Guid id);
    void DeleteMatch(Match match);
    void UpdateMatch(Match match);
    void Save();
  }

  public class MatchRepository : IMatchRepository
  {
    private readonly Context _context;

    public MatchRepository(Context context)
    {
      this._context = context;
    }

    public IEnumerable<Match> GetMatches()
    {
      return _context.Matches.ToList();
    }

    public IEnumerable<Match> GetMyMatches(Guid id)
    {
      var members = _context.GameNightMembers.Where(m => m.UserId == id).Select(m => m.GameNightMemberId);
      var players = _context.MatchPlayers.Where(p => members.Contains(p.GameNightMemberId)).Select(p => p.MatchId);
      return _context.Matches
        // Full Player Tree
        .Include(m => m.Players)
          .ThenInclude(p => p.Member)
            .ThenInclude(m => m.User)
        // Full Game Tree
        .Include(m => m.Game)
          .ThenInclude(g => g.User)
        .Where(m => players.Contains(m.MatchId));
    }

    public Match GetMatch(Guid id)
    {
      var match = _context.Matches
        .Include(m => m.Players)
          .ThenInclude(p => p.Member)
            .ThenInclude(m => m.User)
        .Include(m => m.Game)
          .ThenInclude(g => g.User)
        .FirstOrDefault(m => m.MatchId == id && m.IsActive);

      return match;
    }

    public Match InsertMatch(Match match)
    {
      _context.Matches.Add(match);

      return match;
    }

    public void DeleteMatch(Match match)
    {
      var players = _context.MatchPlayers.Where(p => p.MatchId == match.MatchId);
      _context.MatchPlayers.RemoveRange(players);
      _context.Matches.Remove(match);
    }

    public void UpdateMatch(Match match)
    {
      _context.Entry(match).State = EntityState.Modified;
    }

    public void Save()
    {
      _context.SaveChanges();
    }

    private bool _disposed = false;

    protected virtual void Dispose(bool disposing)
    {
      if (!this._disposed)
      {
        if (disposing)
        {
          _context.Dispose();
        }
      }
      this._disposed = true;
    }

    public void Dispose()
    {
      Dispose(true);
      GC.SuppressFinalize(this);
    }
  }
}
