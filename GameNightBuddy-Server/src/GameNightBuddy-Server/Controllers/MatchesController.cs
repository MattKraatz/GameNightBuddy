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
  [Route("api/v1/matches")]
  public class MatchesController
  {
    private readonly IMatchRepository matchRepository;

    public MatchesController(IMatchRepository matchRepository)
    {
      this.matchRepository = matchRepository;
    }

    [HttpPost]
    public IActionResult CreateMatch([FromBody] Match match)
    {
      if (match == null)
      {
        return new BadRequestResult();
      }

      this.matchRepository.InsertMatch(match);
      this.matchRepository.Save();
      return new CreatedResult("matches", match);
    }
  }
}
