using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;

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
    public IActionResult AddMember([FromBody] GameNightMember member, [FromRoute] Guid id)
    {
      if (member == null)
      {
        return new BadRequestResult();
      }

      this.gameNightRepository.InsertMember(member, id);
      this.gameNightRepository.Save();
      return new CreatedResult($"game-nights/${id}/members", member);
    }

    [HttpPost("{id}/games")]
    public IActionResult AddGame([FromBody] Game game, [FromRoute] Guid id)
    {
      if (game == null)
      {
        return new BadRequestResult();
      }

      this.gameNightRepository.InsertGameNightGame(game.GameId, id);
      this.gameNightRepository.Save();
      return new CreatedResult($"game-nights/${id}/games", game);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GameNight night)
    {
      if (night == null)
      {
        return new BadRequestResult();
      }

      this.gameNightRepository.InsertGameNight(night);
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
