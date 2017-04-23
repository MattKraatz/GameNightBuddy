using GameNightBuddy_Server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Repositories
{
  public interface IMatchRepository : IDisposable
  {
    IEnumerable<Match> GetMatches();
    IEnumerable<Match> GetMyMatches(Guid id);
    Guid InsertMatch(Match match);
    void DeleteMatch(Match match);
    void UpdateMatch(Match match);
    void Save();
  }

  public class MatchRepository : IMatchRepository
  {
    private Context context;

    public MatchRepository(Context context)
    {
      this.context = context;
    }

    public IEnumerable<Match> GetMatches()
    {
      return context.Matches.ToList();
    }

    public IEnumerable<Match> GetMyMatches(Guid id)
    {
      var members = context.GameNightMembers.Where(m => m.UserId == id).Select(m => m.GameNightMemberId);
      var players = context.MatchPlayers.Where(p => members.Contains(p.GameNightMemberId)).Select(p => p.MatchId);
      return context.Matches
        // Full Player Tree
        .Include(m => m.Players)
          .ThenInclude(p => p.Member)
            .ThenInclude(m => m.User)
        // Full Game Tree
        .Include(m => m.Game)
          .ThenInclude(g => g.User)
        .Where(m => players.Contains(m.MatchId))
    }

    public Guid InsertMatch(Match match)
    {
      context.Matches.Add(match);
      return match.MatchId;
    }

    public void DeleteMatch(Match match)
    {
      var players = context.MatchPlayers.Where(p => p.MatchId == match.MatchId);
      context.MatchPlayers.RemoveRange(players);
      context.Matches.Remove(match);
    }

    public void UpdateMatch(Match match)
    {
      context.Entry(match).State = EntityState.Modified;
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
