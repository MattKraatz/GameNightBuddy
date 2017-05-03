using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;
using Newtonsoft.Json;
using GameNightBuddy_Server.ViewModels;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/games")]
  public class GameController
  {
    private readonly IGameRepository gameRepository;
    private readonly IGameNightRepository nightRepository;
    
    public GameController(IGameRepository gameRepository, IGameNightRepository nightRepository)
    {
      this.gameRepository = gameRepository;
      this.nightRepository = nightRepository;
      }

    [HttpGet("my/{userId}")]
    public IActionResult GetMyGames([FromRoute] Guid userId)
    {
      var games = this.gameRepository.GetMyGames(userId);
      if (games == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(games);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Game game)
    {
      if (game == null)
      {
        return new BadRequestResult();
      }

      this.gameRepository.InsertGame(game);
      this.gameRepository.Save();
      return new CreatedResult("games", game);
    }

    [HttpPost("{nightId}")]
    public IActionResult CreateAndAddToGameNight([FromBody] GameViewModel body, [FromRoute] Guid nightId)
    {
      if (body == null)
      {
        return new BadRequestResult();
      }

      var game = new Game(body);

      this.gameRepository.InsertGame(game);
      this.gameRepository.Save();

      this.nightRepository.InsertGameNightGame(game.GameId, nightId);
      this.nightRepository.Save();

      return new CreatedResult("games", body);
    }
  }
}