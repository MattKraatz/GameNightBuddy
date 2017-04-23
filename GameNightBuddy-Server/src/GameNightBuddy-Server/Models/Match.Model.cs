using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Match
    {
        // Primary Key
        public Guid MatchId { get; set; }
        // Foreign Keys
        [Required]
        public Guid GameId { get; set; }
        public Game Game { get; set; }
        public List<MatchPlayer> Players { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public DateTime DateCreated { get; set; }
    }
}
