using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Member
    {
        // Primary Key
        public Guid MemberId { get; set; }
        // Foreign Keys
        public Guid GameNightId { get; set; }
        public Guid UserId { get; set; }

        public DateTime DateCreated { get; set; }
        public Boolean IsActive { get; set; }
    }
}
