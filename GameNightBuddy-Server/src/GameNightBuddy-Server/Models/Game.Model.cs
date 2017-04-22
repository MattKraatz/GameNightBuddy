using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Game
    {
        // Primary Key
        public Guid GameId { get; set; }

        // Foreign Key
        public Guid UserId { get; set; }
        public User User { get; set; }
        public List<GameNightGame> GameNightGames { get; set; }
        public List<Match> Matches { get; set; }

        public string Name { get; set; }
        public int MinPlayers { get; set; }
        public int MaxPlayers { get; set; }
        
        public DateTime DateCreated { get; set; }
        public Boolean IsActive { get; set; }
    }
}
