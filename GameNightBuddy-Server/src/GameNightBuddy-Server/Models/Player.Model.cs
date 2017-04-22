using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Player
    {
        // Primary Key
        public Guid PlayerId { get; set; }
        // Foreign Key
        public Guid MemberId { get; set; }

        public Boolean Winner { get; set; }
        public float Score { get; set; }
        public Boolean FirstTimer { get; set; }
        public string Team { get; set; }
    }
}
