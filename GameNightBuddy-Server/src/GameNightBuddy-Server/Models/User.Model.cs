using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class User
    {
        // Primary Key
        public Guid UserId { get; set; }

        public string FirebaseId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public string PhotoURL { get; set; }
        public string Email { get; set; }

        public DateTime DateCreated { get; set; }
        public Boolean IsActive { get; set; }
    }
}
