using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using Microsoft.Extensions.Logging;
using GameNightBuddy_Server.Constants;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/matches")]
  public class MatchesController
  {
    private readonly IMatchRepository matchRepository;
    private readonly IGameNightRepository nightRepo;
    private readonly IActivityRepository activityRepo;
    private readonly ILogger<MatchRepository> _logger;

    public MatchesController(IMatchRepository matchRepository, IGameNightRepository nightRepo, IActivityRepository activityRepo,
      ILogger<MatchRepository> logger)
    {
      this.matchRepository = matchRepository;
      this.nightRepo = nightRepo;
      this.activityRepo = activityRepo;
      this._logger = logger;
    }

    [HttpDelete("{matchId}")]
    public IActionResult DeactivateMatch([FromHeader] string uid, [FromRoute] Guid matchId)
    {
      _logger.LogInformation(LoggingEvents.UpdateMember, "Removing Match: {ID}", matchId);

      if (matchId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "matchId is null");

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        // get Match from database
        var match = this.matchRepository.GetMatch(matchId);
        if (match == null || !match.IsActive)
        {
          _logger.LogWarning(LoggingEvents.InvalidInput, "Match doesn't exist");
          return new BadRequestResult();
        }
        // get GameNight from database
        var gameNight = this.nightRepo.GetMyGameNights(userId).FirstOrDefault(n => n.GameNightId == match.GameNightId);
        if (gameNight == null || !gameNight.IsActive)
        {
          _logger.LogWarning(LoggingEvents.InvalidInput, "Game Night doesn't exist");
          return new BadRequestResult();
        }
        // check for Host priveleges
        var member = gameNight.Members.FirstOrDefault(m => m.UserId == userId && m.IsActive);
        if (member == null || !member.IsHost)
        {
          _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to deactivate this Member");
          return new BadRequestResult();
        }

        this.matchRepository.DeleteMatch(match);
        this.matchRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.MATCH,
          EntityId = match.MatchId,
          ActivityType = Activities.ActivityTypes.DEACTIVATE,
          GameNightId = match.GameNightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        return new OkResult();
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

  }
}
