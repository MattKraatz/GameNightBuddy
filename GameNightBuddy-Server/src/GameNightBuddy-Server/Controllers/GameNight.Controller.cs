using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

  }
}
