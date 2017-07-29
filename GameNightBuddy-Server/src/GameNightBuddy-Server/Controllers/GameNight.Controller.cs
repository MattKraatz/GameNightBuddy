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

    public GameNightController(IGameNightRepository gameNightRepository, IMatchRepository matchRepo)
    {
      this.gameNightRepository = gameNightRepository;
      this.matchRepo = matchRepo;
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

    [HttpPost("{nightId}/members")]
    public IActionResult AddMember([FromBody] MemberViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var member = new GameNightMember(vm, nightId);

      member = this.gameNightRepository.InsertMember(member);
      this.gameNightRepository.Save();

      return new CreatedResult($"game-nights/${nightId}/members", new MemberViewModel(member));
    }

    [HttpPut("{nightId}/members")]
    // upgrades a member to a host, need to expand functionality
    public IActionResult UpdateMember([FromBody] MemberViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var member = this.gameNightRepository.GetMember(new Guid(vm.MemberId));
      member.IsHost = vm.IsHost;

      //this.gameNightRepository.UpdateMember(member);

      this.gameNightRepository.Save();

      return new ObjectResult(vm);
    }

    [HttpPost("{nightId}/games")]
    public IActionResult AddGame([FromBody] Game vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var game = this.gameNightRepository.InsertGameNightGame(vm.GameId, nightId);
      this.gameNightRepository.Save();
      return new CreatedResult($"game-nights/${nightId}/games", new GameShallowViewModel(game));
    }

    [HttpPost("{nightId}/matches")]
    public IActionResult AddMatch([FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var match = this.gameNightRepository.InsertMatch(vm, nightId);
      this.gameNightRepository.Save();

      vm.MatchId = match.MatchId.ToString();

      return new CreatedResult($"game-nights/${nightId}/matches", vm);
    }

    [HttpPut("{nightId}/matches")]
    public IActionResult UpdateMatch([FromBody] MatchViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      this.gameNightRepository.UpdateMatch(vm);
      this.gameNightRepository.Save();

      var match = this.matchRepo.GetMatch(new Guid(vm.MatchId));

      vm = new MatchViewModel(match);

      return new CreatedResult($"game-nights/${nightId}/matches", vm);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GameNightViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var night = new GameNight(vm);

      this.gameNightRepository.InsertGameNight(night);
      this.gameNightRepository.Save();

      var member = new GameNightMember(vm.Members.First(), night.GameNightId);
      this.gameNightRepository.InsertMember(member);
      this.gameNightRepository.Save();
      
      return new CreatedResult("game-nights", night);
    }

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
