import {SignalR} from 'signalr';
import {IStoreAction} from './appstore.model';

export interface FeedSignalR extends SignalR {
    userBroadcaster: FeedProxy;
    gameNightBroadcaster: FeedProxy;
}
 
export interface FeedProxy {
    client: FeedClient;
    server: FeedServer;
}
 
export interface FeedClient {
    setConnectionId: (id: string) => void;
    DispatchAction: (action: IStoreAction) => void;
}
 
export interface FeedServer {
    subscribe(userId: string): void;
    unsubscribe(userId: string): void;
}
 
export enum SignalRConnectionStatus {
    Connected = 1,
    Disconnected = 2,
    Error = 3
}