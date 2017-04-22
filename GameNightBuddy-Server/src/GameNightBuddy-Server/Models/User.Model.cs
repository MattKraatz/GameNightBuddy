using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class User
    {
        // Primary Key
        public Guid UserId { get; set; }
        // Foreign Keys
        public List<GameNightMember> GameNightsMembers { get; set; }
        public List<Game> Games { get; set; }

        [Required]
        public string FirebaseId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public string PhotoURL { get; set; }
        public string Email { get; set; }

        public DateTime DateCreated { get; set; }
        public Boolean IsActive { get; set; }
    }
}
