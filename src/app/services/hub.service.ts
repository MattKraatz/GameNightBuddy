import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Store} from '@ngrx/store';
import {$} from 'jquery';

import {FeedSignalR, FeedProxy, FeedClient, FeedServer, SignalRConnectionStatus} from '../models/signalr.model';
import {AppStore} from '../models/appstore.model';

import {IStoreAction} from '../models/appstore.model';

const HEADER = { headers: new Headers({ 'Content-Type': 'application/json' }) };

@Injectable()
export class HubService {
  
  // Custom Actions
  dispatchStoreAction: Observable<IStoreAction>;
  private dispatchStoreActionSubject = new Subject<IStoreAction>();

  // Connection Setup
  currentState = SignalRConnectionStatus.Disconnected;

  connectionState: Observable<SignalRConnectionStatus>;
  setConnectionId: Observable<string>;

  private connectionStateSubject = new Subject<SignalRConnectionStatus>();
  private setConnectionIdSubject = new Subject<string>();

  private userServer: FeedServer;
  private nightServer: FeedServer;

  constructor(private store: Store<AppStore>){
    this.dispatchStoreAction = this.dispatchStoreActionSubject.asObservable();

    this.connectionState = this.connectionStateSubject.asObservable();
    this.setConnectionId = this.setConnectionIdSubject.asObservable();
  }

  start(debug: boolean): Observable<SignalRConnectionStatus> {
 
    // Configure the proxy
    let connection = <FeedSignalR>$.connection;

    // reference signalR hubs
    let userHub = connection.userBroadcaster;
    let nightHub = connection.gameNightBroadcaster;

    this.userServer = userHub.server;
    this.nightServer = nightHub.server;
  
    // DispatchAction method called by the server 
    userHub.client.DispatchAction = action => this.onDispatchStoreAction(action);
    nightHub.client.DispatchAction = action => this.onDispatchStoreAction(action);

    // start the connection
    $.connection.hub.start()
        .done(response => this.setConnectionState(SignalRConnectionStatus.Connected))
        .fail(error => this.connectionStateSubject.error(error));
  
    return this.connectionState;
  }

  private setConnectionState(connectionState: SignalRConnectionStatus) {
    console.log('connection state changed to: ' + connectionState);
    this.currentState = connectionState;
    this.connectionStateSubject.next(connectionState);
  }

  // Client side methods
  private onSetConnectionId(id: string) {
      this.setConnectionIdSubject.next(id);
  }

  private onDispatchStoreAction(action: IStoreAction) {
    this.dispatchStoreActionSubject.next(action);
    this.store.dispatch(action);
  }

  // Server side methods
  public subscribeToUserFeed(userId: string) {
    this.userServer.subscribe(userId);
  }

  public unsubscribeFromUserFeed(userId: string) {
    this.userServer.unsubscribe(userId);
  }

  public subscribeToNightFeed(nightId: string) {
    this.nightServer.subscribe(nightId);
  }

  public unsubscribeFromNightFeed(nightId: string) {
    this.nightServer.unsubscribe(nightId);
  }

}