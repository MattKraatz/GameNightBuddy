using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class GameNight
    {
        // Primary Key
        public Guid GameNightId { get; set; }
        public DateTime DateCreated { get; set; }

        public string Name { get; set; }

        public List<Member> Members { get; set; }
    }
}
