using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/users")]
  public class UserController
  {
    private readonly IUserRepository userRepository;

    public UserController(IUserRepository userRepository)
    {
      this.userRepository = userRepository;
    }

    [HttpGet("{fbKey}")]
    public IActionResult GetUserByFbKey([FromRoute] string fbKey)
    {
      var user = this.userRepository.GetUserByFbKey(fbKey);
      if (user == null)
      {
        user = new User() { FirebaseId = fbKey };
        this.userRepository.InsertUser(user);
        this.userRepository.Save();
      }
      return new ObjectResult(user);
    }

    [HttpGet("search/{nightId}/{query}")]
    public IActionResult QueryUsers([FromRoute] string query, [FromRoute] Guid nightId)
    {
      var users = this.userRepository.QueryUsers(query, nightId);
      return new ObjectResult(users);
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] User user)
    {
      if (user == null)
      {
        return new BadRequestResult();
      }

      this.userRepository.InsertUser(user);
      this.userRepository.Save();
      return new CreatedResult("users", user);
    }

    [HttpPut]
    public IActionResult OverwriteUser([FromBody] User user)
    {
      if (user == null)
      {
        return new BadRequestResult();
      }
      
      this.userRepository.UpdateUser(user);
      this.userRepository.Save();
      return new ObjectResult(user);
    }
  }
}
