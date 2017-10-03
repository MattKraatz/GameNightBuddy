using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using GameNightBuddy_Server.ViewModels;
using GameNightBuddy_Server.Models;
using GameNightBuddy_Server.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using GameNightBuddy_Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace GameNightBuddy_Server_Tests
{
  [TestClass]
  public class UserTests
  {
    private Context _context;
    private UserRepository _userRepo { get; set; }
    private UserController _userController { get; set; }
    
    public UserTests()
    {
      var serviceProvider = new ServiceCollection()
        .AddEntityFrameworkSqlServer()
        .BuildServiceProvider();
      var builder = new DbContextOptionsBuilder<Context>();
      builder.UseSqlServer(Environment.GetEnvironmentVariable("GAMENIGHTBUDDY.DEFAULT_CONNECTION"))
                    .UseInternalServiceProvider(serviceProvider);
      _context = new Context(builder.Options);

      _userRepo = new UserRepository(_context);
      _userController = new UserController(_userRepo);
    }

    private AuthViewModel _testAuth1 = new AuthViewModel{
      displayName = "TestUser1",
      email = "user1@test.com",
      photoURL = "https://unsplash.it/200/300",
      uid = "BSx533#QWp"
    };

    private User _testUser2 = new User
    {
      UserId = new Guid(),
      FirebaseId = "=6y5EQn4w6",
      FirstName = "Test",
      LastName = "User2",
      DisplayName = "TestUser2",
      PhotoURL = "https://unsplash.it/200/300",
      Email = "user2@test.com"
    };
    
    [TestMethod]
    public void CanCreateUserViaRepo()
    {
      Guid userId = this._userRepo.InsertUser(_testUser2);
      this._userRepo.Save();
      this._testUser2.UserId = userId;

      Assert.IsTrue(userId != null);
      Assert.IsTrue(userId != Guid.Empty);
      Assert.IsInstanceOfType(userId, typeof(Guid));
    }

    [TestMethod]
    public void CanCreateUserViaController()
    {
      var result = this._userController.GetUserByFbKey(_testAuth1);

      Assert.IsInstanceOfType(result, typeof(ObjectResult));
      // convert to ObjectResult, read value as User
      var resultCast = result as ObjectResult;
      var user = (User)resultCast.Value;

      Assert.IsTrue(user != null);
      Assert.IsTrue(user.UserId != null);
      Assert.IsTrue(user.UserId != Guid.Empty);
      Assert.IsTrue(user.FirebaseId == _testAuth1.uid);
    }

    //[TestMethod]
    //public void CanGetUserViaRepo()
    //{
    //  Assert.IsTrue(false);
    //}

    //[TestMethod]
    //public void CanGetUserViaController()
    //{
    //  Assert.IsTrue(false);
    //}

    [TestMethod]
    public void CanDeactivateUserViaRepo()
    {
      var user = this._userRepo.GetUserByFbKey(_testAuth1.uid);
      this._userRepo.DeactivateUser(user.UserId);
      this._userRepo.Save();
      user = this._userRepo.GetUserByFbKey(_testAuth1.uid);

      Assert.IsFalse(user.IsActive);
    }

    [TestMethod]
    public void CanDeactivateUserViaController()
    {
      var user = this._userRepo.GetUserByFbKey(this._testUser2.FirebaseId);
      user.IsActive = false;
      this._userController.OverwriteUser(user);
      this._userRepo.Save();
      user = this._userRepo.GetUserByFbKey(user.FirebaseId);

      Assert.IsFalse(user.IsActive);
    }

  }
}
