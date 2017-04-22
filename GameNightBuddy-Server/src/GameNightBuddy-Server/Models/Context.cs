﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Models
{
    public class Context: DbContext
    {
        public DbSet<GameNight> GameNights { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<GameNightMember> GameNightMembers { get; set; }
        public DbSet<MatchPlayer> MatchPlayers { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameNightGame> GameNightGames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region DEFAULT VALUES

            // DateCreated
            modelBuilder.Entity<User>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<GameNightMember>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<GameNight>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Game>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<GameNightGame>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            modelBuilder.Entity<Match>()
                .Property(n => n.DateCreated)
                .HasDefaultValueSql("GETDATE()");

            // IsActive default values
            modelBuilder.Entity<User>()
                .Property(n => n.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<GameNightMember>()
                .Property(n => n.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<GameNight>()
                .Property(n => n.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<Game>()
                .Property(n => n.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<GameNightGame>()
                .Property(n => n.IsActive)
                .HasDefaultValue(true);

            #endregion Default Values

            #region INDEXES

            //// Sample index from https://docs.microsoft.com/en-us/ef/core/modeling/indexes
            //modelBuilder.Entity<GameNight>()
            //    .HasIndex(n => n.DateCreated);

            #endregion INDEXES
        }
    }
}
