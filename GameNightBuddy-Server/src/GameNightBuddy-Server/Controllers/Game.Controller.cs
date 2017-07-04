using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

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

    [HttpPut]
    public IActionResult Update([FromBody] GameViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var game = new Game(vm);

      this.gameRepository.UpdateGame(game);
      this.gameRepository.Save();

      var output = new GameViewModel(game);
      output.Owner = vm.Owner;
      return new CreatedResult("games", vm);
    }

    [HttpPost("rating")]
    public IActionResult AddRating([FromBody] GameRating vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      this.gameRepository.AddRating(vm);
      this.gameRepository.Save();

      return new CreatedResult("ratings", vm);
    }

    [HttpPut("rating")]
    public IActionResult UpdateRating([FromBody] GameRating vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      this.gameRepository.UpdateRating(vm);
      this.gameRepository.Save();

      return new OkObjectResult(vm);
    }

    [HttpDelete("rating")]
    public IActionResult DeleteRating([FromBody] GameRating vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      this.gameRepository.DeleteRating(vm);
      this.gameRepository.Save();

      return new OkResult();
    }
  }
}