using GameNightBuddy_Server.Repositories;
using GameNightBuddy_Server.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Controllers
{
  [ProducesAttribute("application/json")]
  [Route("api/v1/users")]
  public class UserController
  {
    private readonly IUserRepository userRepository;

    public UserController(UserRepository userRepository)
    {
      this.userRepository = userRepository;
    }

    [HttpGet("{userId}")]
    public IActionResult GetUser([FromRoute] Guid userId)
    {
      var user = this.userRepository.GetUser(userId);
      if (user == null)
      {
        return new NoContentResult();
      }
      return new ObjectResult(user);
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
      return new OkResult();
    }
  }
}
