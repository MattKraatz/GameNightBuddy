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

      var output = new List<GameViewModel>();
      foreach(var game in games)
      {
        output.Add(new GameViewModel(game));
      }

      return new ObjectResult(output);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GameViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var game = new Game(vm);

      this.gameRepository.InsertGame(game);
      this.gameRepository.Save();

      var output = new GameViewModel(game);
      output.Owner = vm.Owner;
      return new CreatedResult("games", vm);
    }

    [HttpPost("{nightId}")]
    public IActionResult CreateAndAddToGameNight([FromBody] GameViewModel vm, [FromRoute] Guid nightId)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var game = new Game(vm);

      this.gameRepository.InsertGame(game);
      this.gameRepository.Save();

      var output = this.nightRepository.InsertGameNightGame(game.GameId, nightId);
      this.nightRepository.Save();

      return new CreatedResult("games", new GameViewModel(output));
    }
  }
}