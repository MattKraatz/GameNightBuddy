using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class GameNight
    {
        // Primary Key
        public Guid GameNightId { get; set; }

        [Required]
        public string Name { get; set; }

        public List<GameNightMember> Members { get; set; }
        public List<GameNightGame> Games { get; set; }

        public DateTime DateCreated { get; set; }
        public Boolean IsActive { get; set; }
    }
}
