using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;
using System.Net.Http;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/game-nights")]
  public class GameNightController
  {
    private readonly IGameNightRepository gameNightRepository;
    private readonly IMatchRepository matchRepo;
    private readonly IActivityRepository activityRepo;

    public GameNightController(IGameNightRepository gameNightRepository, IMatchRepository matchRepo, IActivityRepository activityRepo)
    {
      this.gameNightRepository = gameNightRepository;
      this.matchRepo = matchRepo;
      this.activityRepo = activityRepo;
    }

    [HttpGet("my")]
    public IActionResult GetMyGameNights([FromHeader] string uid)
    {
      var userId = new Guid(uid);
      var nights = this.gameNightRepository.GetMyGameNights(userId);
      if (nights == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(nights);
    }

    [HttpGet("explore")]
    public IActionResult GetOtherGameNights([FromHeader] string uid)
    {
      var userId = new Guid(uid);
      var nights = this.gameNightRepository.GetOtherGameNights(userId);
      if (nights == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(nights);
    }

    [HttpGet("{nightId}")]
    public IActionResult GetById([FromHeader] string uid, [FromRoute] Guid nightId)
    {
      var userId = new Guid(uid);
      var night = this.gameNightRepository.LoadGameNightByID(nightId, userId);
      if (night == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(night);
    }

    [HttpGet("{nightId}/notifications")]
    public IActionResult GetNotifications([FromHeader] string uid, [FromRoute] Guid nightId)
    {
      var userId = new Guid(uid);
      var notifications = this.activityRepo.GetActivitiesByGameNightId(nightId);
      return new ObjectResult(notifications);
    }

    [HttpPost("{nightId}/members")]
    public IActionResult AddMember([FromHeader] string uid, [FromBody] MemberViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var userId = new Guid(uid);
      var member = new GameNightMember(vm, nightId);

      member = this.gameNightRepository.InsertMember(member);
      this.gameNightRepository.Save();

      var activity = new Activity()
      {
        UserId = userId,
        EntityType = Constants.Activity.Entities.MEMBER,
        EntityId = member.GameNightMemberId,
        ActivityType = Constants.Activity.ActivityTypes.CREATE,
        GameNightId = nightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      return new CreatedResult($"game-nights/${nightId}/members", new MemberViewModel(member));
    }

    [HttpPut("{nightId}/members")]
    // upgrades a member to a host, need to expand functionality
    public IActionResult UpdateMember([FromHeader] string uid, [FromBody] MemberViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var userId = new Guid(uid);
      var member = this.gameNightRepository.GetMember(new Guid(vm.MemberId));
      member.IsHost = vm.IsHost;

      var activity = new Activity()
      {
        UserId = userId,
        EntityType = Constants.Activity.Entities.MEMBER,
        EntityId = member.GameNightMemberId,
        ActivityType = Constants.Activity.ActivityTypes.UPDATE,
        GameNightId = member.GameNightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      this.gameNightRepository.Save();

      return new ObjectResult(vm);
    }

    [HttpPost("{nightId}/games")]
    public IActionResult AddGame([FromHeader] string uid, [FromBody] Game vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var userId = new Guid(uid);
      var game = this.gameNightRepository.InsertGameNightGame(vm.GameId, nightId);
      this.gameNightRepository.Save();

      var activity = new Activity()
      {
        UserId = userId,
        EntityType = Constants.Activity.Entities.GAME,
        EntityId = game.GameId,
        ActivityType = Constants.Activity.ActivityTypes.CREATE,
        GameNightId = nightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      return new CreatedResult($"game-nights/${nightId}/games", new GameShallowViewModel(game));
    }

    [HttpPost("{nightId}/matches")]
    public IActionResult AddMatch([FromHeader] string uid, [FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var userId = new Guid(uid);
      var match = this.gameNightRepository.InsertMatch(vm, nightId);
      this.gameNightRepository.Save();

      var activity = new Activity()
      {
        UserId = userId,
        EntityType = Constants.Activity.Entities.MATCH,
        EntityId = match.MatchId,
        ActivityType = Constants.Activity.ActivityTypes.CREATE,
        GameNightId = nightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      vm.MatchId = match.MatchId.ToString();

      return new CreatedResult($"game-nights/${nightId}/matches", vm);
    }

    [HttpPut("{nightId}/matches")]
    public IActionResult UpdateMatch([FromHeader] string uid, [FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var userId = new Guid(uid);
      this.gameNightRepository.UpdateMatch(vm);
      this.gameNightRepository.Save();

      var activity = new Activity()
      {
        UserId = userId,
        EntityType = Constants.Activity.Entities.GAME,
        EntityId = new Guid(vm.MatchId),
        ActivityType = Constants.Activity.ActivityTypes.UPDATE,
        GameNightId = nightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      var match = this.matchRepo.GetMatch(new Guid(vm.MatchId));
      vm = new MatchViewModel(match);
      return new CreatedResult($"game-nights/${nightId}/matches", vm);
    }

    [HttpPost]
    public IActionResult Create([FromHeader] string uid, [FromBody] GameNightViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

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
        EntityType = Constants.Activity.Entities.GAMENIGHT,
        EntityId = night.GameNightId,
        ActivityType = Constants.Activity.ActivityTypes.CREATE,
        GameNightId = night.GameNightId
      };
      this.activityRepo.CreateActivity(activity);
      this.activityRepo.Save();

      return new CreatedResult("game-nights", night);
    }

    // not in use by the client
    [HttpGet]
    public IActionResult GetAll()
    {
      var nights = this.gameNightRepository.GetGameNights();
      if (nights == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(nights);
    }

  }
}
