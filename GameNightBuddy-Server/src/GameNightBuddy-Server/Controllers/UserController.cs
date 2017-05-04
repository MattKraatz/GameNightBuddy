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
        return new NoContentResult();
      }
      return new ObjectResult(user);
    }

    [HttpGet("search/{query}")]
    public IActionResult QueryUsers([FromRoute] string query)
    {
      var users = this.userRepository.QueryUsers(query);
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
      return new OkResult();
    }
  }
}
