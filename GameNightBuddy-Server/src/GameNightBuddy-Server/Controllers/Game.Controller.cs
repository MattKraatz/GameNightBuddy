using GameNightBuddy_Server.Constants;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
    private readonly IActivityRepository activityRepo;
    private readonly ILogger _logger;

    public GameController(IGameRepository gameRepository, IGameNightRepository nightRepository, IActivityRepository activityRepo,
                          ILogger<GameController> logger)
    {
      this.gameRepository = gameRepository;
      this.nightRepository = nightRepository;
      this.activityRepo = activityRepo;
      this._logger = logger;
    }

    [HttpGet("my")]
    public IActionResult GetMyGames([FromHeader] string uid)
    {
      _logger.LogInformation(LoggingEvents.GetMyGames, "Getting Games for user: {ID}", uid);

      try
      {
        var userId = new Guid(uid);
        var games = this.gameRepository.GetMyGames(userId);
        if (games == null)
        {
          _logger.LogInformation(LoggingEvents.GetFailed, "No  Games found for user: {ID}", uid);
          return new NoContentResult();
        }

        var output = new List<GameViewModel>();
        foreach (var game in games)
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
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpPost]
    public IActionResult Create([FromHeader] string uid, [FromBody] GameViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.CreateGame, "User {uid} is creating a Game", uid);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "No GameViewModel provided");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var game = new Game(vm);

        this.gameRepository.InsertGame(game);
        this.gameRepository.Save();

        var output = new GameShallowViewModel(game)
        {
          Owner = vm.Owner
        };
        return new CreatedResult("games", vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpPut("rating")]
    public IActionResult UpdateGameRating([FromHeader] string uid, [FromBody] GameRatingViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.UpdateGameRating, "User {uid} is updating a GameRating for Game {gid}", uid, vm?.GameId);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.InvalidInput, "No GameRatingViewModel provided");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var rating = new GameRating(vm);

        this.gameRepository.UpdateRating(rating);
        this.gameRepository.Save();

        return new CreatedResult("ratings", vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpPost("{nightId}")]
    public IActionResult CreateAndAddToGameNight([FromHeader] string uid, [FromBody] GameViewModel vm, [FromRoute] Guid nightId)
    {
      _logger.LogInformation(LoggingEvents.CreateGameAndAddToGameNight, "User {uid} is creating a Game and adding it to Game Night {nid}", uid, nightId);

      if (vm == null || nightId == Guid.Empty)
      {
        _logger.LogWarning(LoggingEvents.CreateGameAndAddToGameNight, "Invalid input; GameViewModel: {vm} ;; NightId: {nightId} ;");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var game = new Game(vm);

        this.gameRepository.InsertGame(game);
        this.gameRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAME,
          EntityId = game.GameId,
          ActivityType = Activities.ActivityTypes.CREATE
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        var output = this.nightRepository.InsertGameNightGame(game.GameId, nightId);
        this.nightRepository.Save();

        return new CreatedResult("games", new GameShallowViewModel(output));
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpPut]
    public IActionResult Update([FromHeader] string uid, [FromBody] GameViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.UpdateGame, "User {uid} is updating Game {gid}", uid, vm.GameId);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.UpdateGame, "GameViewModel is null");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var game = new Game(vm);

        this.gameRepository.UpdateGame(game);
        this.gameRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAME,
          EntityId = game.GameId,
          ActivityType = Activities.ActivityTypes.UPDATE
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        var output = new GameShallowViewModel(game)
        {
          Owner = vm.Owner
        };
        return new CreatedResult("games", vm);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }
    
    [HttpPost("recommend")]
    public IActionResult RecommendGame([FromHeader] string uid, [FromBody] GameRecRequestViewModel vm)
    {
      _logger.LogInformation(LoggingEvents.GetGameRecommendation, "User {uid} is getting Game Recommendations", uid);

      if (vm == null)
      {
        _logger.LogWarning(LoggingEvents.GetGameRecommendation, "GameRecRequestViewModel is null");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);
        var recs = new List<GameViewModel>();
        bool requesterIsInParty = vm.UserIds.Contains(userId);

        var games = this.gameRepository.GetGameRecommendations(vm, userId);

        if (games.Count() > 0)
        {
          foreach (Game game in games)
          {
            int myRating = 0;

            // if requester isn't in party, filter their rating out (for averaging in the constructor) 
            if (!requesterIsInParty)
            {
              myRating = game.GameRatings.FirstOrDefault(r => r.UserId == userId).Rating;
              game.GameRatings = game.GameRatings.Where(r => r.UserId != userId).ToList();
            }

            var gameVM = new GameViewModel(game, userId);

            if (myRating != 0)
            {
              gameVM.MyRating = myRating;
            }

            recs.Add(gameVM);
          }
        }

        return new ObjectResult(recs);
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }

    [HttpDelete("{gameId}")]
    public IActionResult DeleteGame([FromHeader] string uid, [FromRoute] Guid gameId)
    {
      _logger.LogInformation(LoggingEvents.UpdateGame, "User {uid} is deleting Game {gameId}", uid, gameId);

      if (gameId == null)
      {
        _logger.LogWarning(LoggingEvents.UpdateGame, "gameId is null");
        return new BadRequestResult();
      }

      try
      {
        var userId = new Guid(uid);

        var game = this.gameRepository.GetMyGames(userId).SingleOrDefault(g => g.GameId == gameId);
        if (game == null)
        {
          _logger.LogWarning(LoggingEvents.InvalidInput, "user not authorized to delete this game");
          return new BadRequestResult();
        }

        this.gameRepository.DeactivateGame(gameId);
        this.gameRepository.Save();

        var activity = new Activity()
        {
          UserId = userId,
          EntityType = Activities.Entities.GAME,
          EntityId = gameId,
          ActivityType = Activities.ActivityTypes.DEACTIVATE
        };
        this.activityRepo.CreateActivity(activity);
        this.activityRepo.Save();

        return new OkResult();
      }
      catch (Exception ex)
      {
        _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new NoContentResult();
      }
    }
  }
}