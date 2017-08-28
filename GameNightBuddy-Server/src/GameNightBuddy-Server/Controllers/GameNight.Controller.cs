using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using System.Net.Http;
using Microsoft.Extensions.Logging;
using GameNightBuddy_Server.Constants;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/game-nights")]
  public class GameNightController
  {
    private readonly IGameNightRepository gameNightRepository;
    private readonly IMatchRepository matchRepo;
    private readonly IActivityRepository activityRepo;
    private readonly ILogger _logger;

    public GameNightController(IGameNightRepository gameNightRepository, IMatchRepository matchRepo, IActivityRepository activityRepo,
                               ILogger<GameNightController> logger)
    {
      this.gameNightRepository = gameNightRepository;
      this.matchRepo = matchRepo;
      this.activityRepo = activityRepo;
      this._logger = logger;
    }

    // METHOD STRUCTURE
    // Logging
    // Null Checking
    // DoWork in a Try/Catch

    [HttpGet("my")]
    public IActionResult GetMyGameNights([FromHeader] string uid)
    {
      _logger.LogInformation(LoggingEvents.GetMyGameNights, "Getting Game Nights for user: {ID}", uid);

      try
      {
        var userId = new Guid(uid);
        var nights = this.gameNightRepository.GetMyGameNights(userId);
        if (nights == null)
        {
          _logger.LogInformation(LoggingEvents.GetFailed, "No Game Nights found for user: {ID}", uid);

          return new NoContentResult();
        }
        return new ObjectResult(nights);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpGet("explore")]
    public IActionResult GetOtherGameNights([FromHeader] string uid)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "Getting OTHER Game Nights for user: {ID}", uid);

      try
      {
        var userId = new Guid(uid);
        var nights = this.gameNightRepository.GetOtherGameNights(userId);
        if (nights == null)
        {
          _logger.LogInformation(LoggingEvents.GetFailed, "No OTHER Game Nights found for user: {ID}", uid);
          return new NoContentResult();
        }
        return new ObjectResult(nights);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpGet("{nightId}")]
    public IActionResult GetById([FromHeader] string uid, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "Getting OTHER Game Nights for user: {ID}", uid);

      if (nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "No NightId provided");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var night = this.gameNightRepository.LoadGameNightById(nightId, userId);
        if (night == null)
        {
          return new NoContentResult();
        }
        return new ObjectResult(night);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpGet("{nightId}/notifications")]
    public IActionResult GetNotifications([FromHeader] string uid, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.GetGameNightNotifications, "Getting Notifications for Game Night: {ID}", nightId);

      if (nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "No NightId provided");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var notifications = this.activityRepo.GetActivitiesByGameNightId(nightId);
        return new ObjectResult(notifications);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPost("{nightId}/members")]
    public IActionResult AddMember([FromHeader] string uid, [FromBody] MemberViewModel vm, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.AddMember, "User {uid} is trying to add user {mid} to Game Night {nightId}", uid, vm?.UserId, nightId);

      if (vm == null || nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "MemberViewModel: {VM};; NightId: {NID}", vm, nightId);

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var member = new GameNightMember(vm, nightId);

        member = this.gameNightRepository.InsertMember(member);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.MEMBER,
          EntityId = member.GameNightMemberId,
          ActivityType = Activities.ActivityTypes.CREATE,
          GameNightId = nightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        return new CreatedResult($"game-nights/${nightId}/members", new MemberViewModel(member));
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPut("{nightId}/members")]
    // upgrades a member to a host, need to expand functionality
    public IActionResult UpdateMember([FromHeader] string uid, [FromBody] MemberViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.UpdateMember, "Updating Member: {ID}", vm?.MemberId);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "MemberViewModel is null");

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var member = this.gameNightRepository.GetMember(new Guid(vm.MemberId));
        member.IsHost = vm.IsHost;

        this.gameNightRepository.Save();

        return new ObjectResult(vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPost("{nightId}/games")]
    public IActionResult AddGame([FromHeader] string uid, [FromBody] Game vm, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.AddGameToGameNight, "User {uid} is adding Game {gid} to Game Night {ID}", uid, vm?.GameId, nightId);

      if (vm == null || nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "GameViewModel: {VM};; NightId: {NID}", vm, nightId);

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var game = this.gameNightRepository.InsertGameNightGame(vm.GameId, nightId);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAME,
          EntityId = game.GameId,
          ActivityType = Activities.ActivityTypes.CREATE,
          GameNightId = nightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        return new CreatedResult($"game-nights/${nightId}/games", new GameShallowViewModel(game));
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpPost("{nightId}/matches")]
    public IActionResult AddMatch([FromHeader] string uid, [FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "User {uid} is adding a Match to Game Night {gid}", uid, nightId);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "MatchViewModel: {VM};; NightId: {NID}", vm, nightId);

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var match = this.gameNightRepository.InsertMatch(vm, nightId);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.MATCH,
          EntityId = match.MatchId,
          ActivityType = Activities.ActivityTypes.CREATE,
          GameNightId = nightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        vm.MatchId = match.MatchId.ToString();

        return new CreatedResult($"game-nights/${nightId}/matches", vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPut("{nightId}/matches")]
    public IActionResult UpdateMatch([FromHeader] string uid, [FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "User {uid} is updating Match {mid}", uid, vm?.MatchId);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "MatchViewModel: {VM};; NightId: {NID}", vm, nightId);

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        this.gameNightRepository.UpdateMatch(vm);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.MATCH,
          EntityId = new Guid(vm.MatchId),
          ActivityType = Activities.ActivityTypes.UPDATE,
          GameNightId = nightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        var match = this.matchRepo.GetMatch(new Guid(vm.MatchId));
        vm = new MatchViewModel(match);
        return new CreatedResult($"game-nights/${nightId}/matches", vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPost]
    public IActionResult Create([FromHeader] string uid, [FromBody] GameNightViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "User {uid} is creating a GameNight", uid);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "GameNightViewModel is null");

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var night = new GameNight(vm);

        this.gameNightRepository.InsertGameNight(night);
        this.gameNightRepository.Save();

        var member = new GameNightMember(vm.Members.First(), night.GameNightId);
        this.gameNightRepository.InsertMember(member);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAMENIGHT,
          EntityId = night.GameNightId,
          ActivityType = Activities.ActivityTypes.CREATE,
          GameNightId = night.GameNightId
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        return new CreatedResult("game-nights", night);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpDelete("members/{memberId}")]
    public IActionResult DeleteMember([FromHeader] string uid, [FromRoute] Guid memberId)
    {
      _logger.LogInformation(LoggingEvents.UpdateMember, "Removing Member: {ID}", memberId);

      if (memberId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "memberId is null");

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        // get Member from database
        var member = this.gameNightRepository.GetMember(memberId);
        // get GameNight from database
        GameNight night = this.gameNightRepository.GetMyGameNights(userId)?.FirstOrDefault(n => n.GameNightId == member?.GameNightId && n.IsActive);

        // if this member is trying to remove themself, don't check for authorization
        if (member.UserId != userId)
        {
          if (!member.IsActive)
          {
            _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to deactivate this Member");
            return new BadRequestResult();
          }

          if (night == null || !night.IsActive)
          {
            _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to deactivate this Member");
            return new BadRequestResult();
          }
          // check for Host priveleges
          var host = night.Members.FirstOrDefault(m => m.UserId == userId && m.IsActive);
          if (host == null || !host.IsHost)
          {
            _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to deactivate this Member");
            return new BadRequestResult();
          }
        }

        this.gameNightRepository.DeactivateMember(member);
        if (night != null && night.Members.Count <= 1)
        {
          _logger.LogInformation(LoggingEvents.DeactivateMember, "Game Night {gid} has no members left, now de-activating", night.GameNightId);
          this.gameNightRepository.DeactivateGameNight(night.GameNightId);
        }

        this.gameNightRepository.Save();

        return new OkResult();
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpDelete("{nightId}")]
    public IActionResult Delete([FromHeader] string uid, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.GetOtherGameNights, "User {uid} is deleting GameNight {nightId}", uid, nightId);

      if (nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "nightId is null");

        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);

        // get this user's game nights, check for host status
        var gameNight = this.gameNightRepository.GetMyGameNights(userId).SingleOrDefault(n => n.GameNightId == nightId);
        // if user does not have access to this gameNight, return badRequest
        if (gameNight == null) {
          _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to delete this gameNight");
          return new BadRequestResult();
        }
        var host = gameNight.Members.SingleOrDefault(m => m.UserId == userId && m.IsHost);
        // if user does not have host priveleges on this gameNight, return badRequest
        if (host == null)
        {
          _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to delete this gameNight");
          return new BadRequestResult();
        }

        this.gameNightRepository.DeactivateGameNight(nightId);
        this.gameNightRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAMENIGHT,
          EntityId = nightId,
          ActivityType = Activities.ActivityTypes.DEACTIVATE,
          GameNightId = nightId
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
    
    // not in use by the client
    [HttpGet]
    public IActionResult GetAll()
    {
      _logger.LogInformation(LoggingEvents.GetAllGameNights, "Getting ALL Game Nights");

      try
      {
        var nights = this.gameNightRepository.GetGameNights();
        if (nights == null)
        {
          _logger.LogWarning(LoggingEvents.GetFailed, "Getting ALL Game Nights returned null");

          return new NoContentResult();
        }
        return new ObjectResult(nights);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

  }
}
