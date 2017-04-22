using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Context: DbContext
    {
        public DbSet<GameNight> GameNights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Game Night Config
            modelBuilder.Entity<GameNight>()
                .HasKey(n => n.GameNightId);

            modelBuilder.Entity<GameNight>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");
        }
    }
}
