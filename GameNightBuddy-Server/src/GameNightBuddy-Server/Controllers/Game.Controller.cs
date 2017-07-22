using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

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
        var vm = new GameViewModel(game, userId);
        var myRating = game.GameRatings.FirstOrDefault(r => r.UserId == userId);
        if (myRating != null)
        {
          vm.MyRating = myRating.Rating;
        }
        output.Add(vm);
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

      var output = new GameShallowViewModel(game)
      {
        Owner = vm.Owner
      };
      return new CreatedResult("games", vm);
    }

    [HttpPut("rating")]
    public IActionResult UpdateGameRating([FromBody] GameRatingViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var rating = new GameRating(vm);

      this.gameRepository.UpdateRating(rating);
      this.gameRepository.Save();

      return new CreatedResult("ratings", vm);
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

      return new CreatedResult("games", new GameShallowViewModel(output));
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

      var output = new GameShallowViewModel(game)
      {
        Owner = vm.Owner
      };
      return new CreatedResult("games", vm);
    }

    [HttpDelete("rating")]
    public IActionResult DeleteRating([FromBody] GameRatingViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      throw new NotImplementedException();

      //this.gameRepository.DeleteRating(vm);
      //this.gameRepository.Save();

      //return new OkResult();
    }

    [HttpPost("recommend")]
    public IActionResult RecommendGame([FromBody] GameRecRequestViewModel vm)
    {
      if (vm == null)
      {
        return new BadRequestResult();
      }

      var recs = new List<GameViewModel>();
      bool requesterIsInParty = vm.UserIds.Contains(vm.RequestingUserId);

      var games = this.gameRepository.GetGameRecommendations(vm);

      if (games.Count() > 0)
      {
        foreach(Game game in games)
        {
          int myRating = 0;

          // if requester isn't in party, filter their rating out (for averaging in the constructor) 
          if (!requesterIsInParty)
          {
            myRating = game.GameRatings.FirstOrDefault(r => r.UserId == vm.RequestingUserId).Rating;
            game.GameRatings = game.GameRatings.Where(r => r.UserId != vm.RequestingUserId).ToList();
          }

          var gameVM = new GameViewModel(game, vm.RequestingUserId);

          if (myRating != 0)
          {
            gameVM.MyRating = myRating;
          }

          recs.Add(gameVM);
        }
      }

      return new ObjectResult(recs);
    }
  }
}