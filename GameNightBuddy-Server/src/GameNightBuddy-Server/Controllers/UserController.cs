using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.ViewModels;
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

    [HttpPost]
    public IActionResult GetUserByFbKey([FromBody] AuthViewModel input)
    {
      var user = this.userRepository.GetUserByFbKey(input.uid);
      if (user == null)
      {
        user = new User(input);
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
