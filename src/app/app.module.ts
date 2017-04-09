// Third-Party Dependencies
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import * as firebase from 'firebase';
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";

// Private Keys
import {firebaseConfig} from './constants/firebaseConfig';

// Stores and Services
import {collection} from './stores/collection.store';
import {matches} from './stores/matches.store';
import {auth} from './stores/auth.store';
import {gameNight} from './stores/game-night.store';
import {myGameNights} from './stores/my-game-nights.store';
import {MembersService} from './services/members.service';
import {CollectionService} from './services/collection.service';
import {MatchService} from './services/match.service';
import {AuthService} from './services/auth.service';
import {EmailAuthComponent} from './components/auth/email-auth/email-auth.component';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import {GameNightService} from './services/game-night.service';
import {GameNightListResolver} from './services/resolvers/game-night-list-resolver.service';

// Components
import {AppComponent} from './app.component';
import {MatchesComponent} from './components/matches/matches/matches.component';
import {CollectionComponent} from './components/collection/collection/collection.component';
import {LoginComponent} from './components/auth/login/login.component';
import {MembersComponent} from './components/members/members/members.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {HomeComponent} from './components/home/home.component';
import {MemberFormComponent} from './components/members/member-form/member-form.component';
import {MemberListComponent} from './components/members/member-list/member-list.component';
import {GameListComponent} from './components/collection/game-list/game-list.component';
import {GameFormComponent} from './components/collection/game-form/game-form.component';
import {MatchListComponent} from './components/matches/match-list/match-list.component';
import {MatchFormComponent} from './components/matches/match-form/match-form.component';
import {UserProfileComponent} from './components/user/user-profile/user-profile.component';
import {ExploreComponent} from './components/explore/explore.component';
import {GameNightListComponent} from './components/game-nights/game-night-list/game-night-list.component';
import {GameNightHomeComponent} from './components/game-nights/game-night-home/game-night-home.component';
import {GameNightCollectionComponent} from './components/game-nights/game-night-collection/game-night-collection.component';
import {GameNightMatchesComponent} from './components/game-nights/game-night-matches/game-night-matches.component';
import {GameNightRegistrationComponent} from './components/game-nights/game-night-registration/game-night-registration.component';
import {GameNightMembersComponent} from './components/game-nights/game-night-members/game-night-members.component';
import {GameNightNavbarComponent} from './components/game-nights/game-night-navbar/game-night-navbar.component';
import {GameNightComponent} from './components/game-nights/game-night/game-night.component';
import {MyGameNightsComponent} from './components/game-nights/my-game-nights/my-game-nights.component';

// Route Definitions for NG Router
const appRoutes: Routes = [
  // GAME NIGHTS
  {
    path: 'game-night/:id',
    component: GameNightComponent,
    children: [
      {
        path: 'members',
        component: GameNightMembersComponent
      },
      {
        path: 'collection',
        component: GameNightCollectionComponent
      },
      {
        path: 'matches',
        component: GameNightMatchesComponent
      },
      {
        path: '',
        component: GameNightHomeComponent
      },
      {
        path: '**',
        component: GameNightHomeComponent
      }
    ]
  },
  {
    path: 'new-game-night',
    component: GameNightRegistrationComponent,
    canActivate: [AuthGuard]
  },
  // USER
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-game-nights',
    canActivate: [AuthGuard],
    component: MyGameNightsComponent
  },
  {
    path: 'my-matches',
    canActivate: [AuthGuard],
    component: MatchesComponent
  },
  {
    path: 'my-collection',
    canActivate: [AuthGuard],
    component: CollectionComponent
  },
  // EXPLORE
  {path: 'explore', component: ExploreComponent},
  // AUTH
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {path: 'email-auth', component: EmailAuthComponent},
  // DEFAULTS
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

// Default Authorization Config for AngularFireModule
const authConfig = {
  provider: AuthProviders.Facebook,
  method: AuthMethods.Redirect
}

@NgModule({
  declarations: [
    AppComponent,
    MatchesComponent,
    CollectionComponent,
    LoginComponent,
    MembersComponent,
    NavbarComponent,
    HomeComponent,
    MemberFormComponent,
    MemberListComponent,
    GameListComponent,
    GameFormComponent,
    MatchListComponent,
    MatchFormComponent,
    EmailAuthComponent,
    UserProfileComponent,
    ExploreComponent,
    GameNightListComponent,
    GameNightHomeComponent,
    GameNightCollectionComponent,
    GameNightMatchesComponent,
    GameNightRegistrationComponent,
    GameNightMembersComponent,
    GameNightNavbarComponent,
    GameNightComponent,
    MyGameNightsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({collection, matches, auth, gameNight, myGameNights}),
    AngularFireModule.initializeApp(firebaseConfig, authConfig)
  ],
  providers: [
    MembersService,
    CollectionService,
    MatchService,
    AuthService,
    LoginGuard,
    AuthGuard,
    GameNightService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
