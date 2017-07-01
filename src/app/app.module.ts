// Third-Party Dependencies
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import * as firebase from 'firebase';
import * as $ from 'jquery';
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";
import {NgxPaginationModule} from 'ngx-pagination';

// Private Keys
import {firebaseConfig} from './constants/firebaseConfig';
import {ServerConfig} from './constants/serverConfig';

// Stores and Services
import {collection} from './stores/collection.store';
import {matches} from './stores/matches.store';
import {gameNight} from './stores/game-night.store';
import {myGameNights} from './stores/my-game-nights.store';
import {user} from './stores/user.store';
import {otherGameNights} from './stores/other-game-nights.store';
import {CollectionService} from './services/collection.service';
import {MatchService} from './services/match.service';
import {AuthService} from './services/auth.service';
import {EmailAuthComponent} from './components/auth/email-auth/email-auth.component';
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import {GameNightService} from './services/game-night.service';
import {GameNightResolver} from './services/resolvers/game-night-resolver.service';
import {ProfileCompleteGuard} from './services/guards/profile-complete-guard.service';
import {NavbarService} from './services/navbar.service';

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
import {UserSearchComponent} from './components/members/user-search/user-search.component';
import {MatchDetailComponent} from './components/matches/match-detail/match-detail.component';
import {GameDropdownComponent} from './components/collection/game-dropdown/game-dropdown.component';
import {ExploreGameNightListComponent} from './components/explore/explore-game-night-list/explore-game-night-list.component';
import {SmallLoadingIndicatorComponent} from './components/global/small-loading-indicator/small-loading-indicator.component';
import { MatchInfoComponent } from './components/matches/match-info/match-info.component';
import { GameDetailComponent } from './components/collection/game-detail/game-detail.component';
import { GameInfoComponent } from './components/collection/game-info/game-info.component';

// Route Definitions for NG Router
const appRoutes: Routes = [
  // GAME NIGHTS
  {
    path: 'game-night/:id',
    component: GameNightComponent,
    resolve: {
      gameNight: GameNightResolver
    },
    canActivate: [ProfileCompleteGuard],
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
        path: 'collection/:gameId',
        component: GameDetailComponent
      },
      {
        path: 'matches',
        component: GameNightMatchesComponent
      },
      {
        path: 'matches/:matchId',
        component: MatchDetailComponent
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
    canActivate: [AuthGuard, ProfileCompleteGuard]
  },
  // USER
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-game-nights',
    canActivate: [AuthGuard, ProfileCompleteGuard],
    component: MyGameNightsComponent
  },
  {
    path: 'my-collection',
    canActivate: [AuthGuard, ProfileCompleteGuard],
    component: CollectionComponent
  },
  {
    path: 'my-collection/:gameId',
    canActivate: [AuthGuard, ProfileCompleteGuard],
    component: GameDetailComponent
  },
  // EXPLORE
  {
    path: 'explore',
    canActivate: [AuthGuard, ProfileCompleteGuard],    
    component: ExploreComponent
  },
  // AUTH
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginComponent
  },
  {path: 'email-auth', component: EmailAuthComponent},
  // 404/REDIRECT
  {
    path: '**',
    canActivate: [AuthGuard, ProfileCompleteGuard],
    component: HomeComponent
  },
  // DEFAULT
  {path: '', component: HomeComponent}
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
    MyGameNightsComponent,
    UserSearchComponent,
    MatchDetailComponent,
    GameDropdownComponent,
    ExploreGameNightListComponent,
    SmallLoadingIndicatorComponent,
    MatchInfoComponent,
    GameDetailComponent,
    GameInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({user, collection, matches, gameNight, myGameNights, otherGameNights}),
    AngularFireModule.initializeApp(firebaseConfig, authConfig),
    NgxPaginationModule
  ],
  providers: [
    CollectionService,
    MatchService,
    AuthService,
    LoginGuard,
    AuthGuard,
    GameNightService,
    GameNightResolver,
    ProfileCompleteGuard,
    NavbarService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
