using GameNightBuddy_Server.Constants;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/users")]
  public class UserController
  {
    private readonly IUserRepository userRepository;
    private readonly ILogger _logger;

    public UserController(IUserRepository userRepository, ILogger<UserController> logger)
    {
      this.userRepository = userRepository;
      this._logger = logger;
    }

    // OVERLOAD FOR TESTING
    public UserController(IUserRepository userRepository)
    {
      this.userRepository = userRepository;
    }

    [HttpPost]
    public IActionResult GetUserByFbKey([FromBody] AuthViewModel input)
    {
      if (_logger != null) _logger.LogInformation(LoggingEvents.GetUser, "Getting user by Firebase key {uid}", input?.uid);
      if (input == null)
      {
        if (_logger != null) _logger.LogWarning(LoggingEvents.InvalidInput, "No AuthViewModel provided");
        return new BadRequestResult();
      }

      try
      {
        var user = this.userRepository.GetUserByFbKey(input.uid);
        // create a new user if input FbKey is not found
        if (user == null)
        {
          user = new User(input);
          this.userRepository.InsertUser(user);
          this.userRepository.Save();
        }
        return new ObjectResult(user);
      }
      catch(Exception ex)
      {
        if (_logger != null) _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpGet("search/{nightId}/{query}")]
    public IActionResult QueryUsers([FromRoute] string query, [FromRoute] Guid nightId)
    {
      if (_logger != null)  _logger.LogInformation(LoggingEvents.QueryUsers, "Query for members of Game Night {nid} :: {query} ", nightId, query);
      if (query?.Length < 1 || nightId == Guid.Empty)
      {
        if (_logger != null)  _logger.LogWarning(LoggingEvents.InvalidInput, "Invalid Input; Query: {qry} ;; NightId: {nid}", query, nightId);
        return new BadRequestResult();
      }

      try
      {
        var users = this.userRepository.QueryUsers(query, nightId);
        return new ObjectResult(users);
      }
      catch (Exception ex)
      {
        if (_logger != null)  _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }

    [HttpPut]
    public IActionResult OverwriteUser([FromBody] User user)
    {
      if (_logger != null)  _logger.LogInformation(LoggingEvents.UpdateUser, "Updating User {uid}", user?.UserId);
      if (user == null)
      {
        if (_logger != null)  _logger.LogWarning(LoggingEvents.InvalidInput, "No User provided");
        return new BadRequestResult();
      }

      try
      {
        this.userRepository.UpdateUser(user);
        this.userRepository.Save();
        return new ObjectResult(user);
      }
      catch(Exception ex)
      {
        if (_logger != null)  _logger.LogError(LoggingEvents.Unexpectederror, ex, "Unhandled Exception");
        return new BadRequestResult();
      }
    }
  }
}
