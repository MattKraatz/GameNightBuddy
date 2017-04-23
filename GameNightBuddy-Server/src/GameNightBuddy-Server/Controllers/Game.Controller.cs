﻿using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameNightBuddy_Server.Models;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/games")]
  public class GameController
  {
    private readonly IGameRepository gameRepository;

    public GameController(IGameRepository gameRepository)
    {
      this.gameRepository = gameRepository;
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
  }
}