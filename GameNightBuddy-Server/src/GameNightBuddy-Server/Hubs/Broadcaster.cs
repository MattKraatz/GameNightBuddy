using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameNightBuddy_Server.Hubs
{
    public class Broadcaster : Hub<IBroadcaster>
    {
        public override Task OnConnected()
        {
            // Set connection id for just connected client only
            return Clients.Client(Context.ConnectionId).SetConnectionId(Context.ConnectionId);
        }

        // Server side methods called from client
        public Task Subscribe(int nightId)
        {
            return Groups.Add(Context.ConnectionId, nightId.ToString());
        }

        public Task Unsubscribe(int nightId)
        {
            return Groups.Remove(Context.ConnectionId, nightId.ToString());
        }
    }

    // Client Side Methods
    public interface IBroadcaster
    {
        Task SetConnectionId(string connectionId);
        //Task UpdateMatch(MatchViewModel match);
        //Task AddFeed(FeedViewModel feed);
        //Task AddChatMessage(ChatMessage message);
    }
}
