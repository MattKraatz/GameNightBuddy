using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.ViewModels;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/game-nights")]
  public class GameNightController
  {
    private readonly IGameNightRepository gameNightRepository;

    public GameNightController(IGameNightRepository gameNightRepository)
    {
      this.gameNightRepository = gameNightRepository;
    }

    [HttpGet("my/{userId}")]
    public IActionResult GetMyGameNights([FromRoute] Guid userId)
    {
      var nights = this.gameNightRepository.GetMyGameNights(userId);
      if (nights == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(nights);
    }

    [HttpGet("explore/{userId}")]
    public IActionResult GetOtherGameNights([FromRoute] Guid userId)
    {
      var nights = this.gameNightRepository.GetOtherGameNights(userId);
      if (nights == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(nights);
    }

    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] Guid id)
    {
      var night = this.gameNightRepository.LoadGameNightByID(id);
      if (night == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(night);
    }

    [HttpPost("{id}/members")]
    public IActionResult AddMember([FromBody] MemberViewModel vm, [FromRoute] Guid id)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var member = new GameNightMember(vm, id);

      member = this.gameNightRepository.InsertMember(member);
      this.gameNightRepository.Save();

      return new CreatedResult($"game-nights/${id}/members", new MemberViewModel(member));
    }

    [HttpPost("{id}/games")]
    public IActionResult AddGame([FromBody] Game vm, [FromRoute] Guid id)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var game = this.gameNightRepository.InsertGameNightGame(vm.GameId, id);
      this.gameNightRepository.Save();
      return new CreatedResult($"game-nights/${id}/games", new GameViewModel(game));
    }

    [HttpPost("{id}/matches")]
    public IActionResult AddMatch([FromBody] MatchViewModel vm, [FromRoute] Guid id)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var match = this.gameNightRepository.InsertMatch(vm, id);
      this.gameNightRepository.Save();

      vm.MatchId = match.MatchId.ToString();

      return new CreatedResult($"game-nights/${id}/matches", vm);
    }

    [HttpPut("{id}/matches")]
    public IActionResult UpdateMatch([FromBody] MatchViewModel vm, [FromRoute] Guid id)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var match = this.gameNightRepository.UpdateMatch(vm);
      this.gameNightRepository.Save();

      vm = new MatchViewModel(match);

      return new CreatedResult($"game-nights/${id}/matches", vm);
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
