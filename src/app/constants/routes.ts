import {Routes} from '@angular/router';

// Stores and Services
import {LoginGuard} from '../services/guards/login-guard.service';
import {AuthGuard} from '../services/guards/auth-guard.service';
import {GameNightResolver} from '../services/resolvers/game-night-resolver.service';
import {ProfileCompleteGuard} from '../services/guards/profile-complete-guard.service';

// Components
import {MatchesComponent} from '../components/matches/matches/matches.component';
import {CollectionComponent} from '../components/collection/collection/collection.component';
import {LoginComponent} from '../components/auth/login/login.component';
import {MembersComponent} from '../components/members/members/members.component';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {HomeComponent} from '../components/home/home.component';
import {UserProfileComponent} from '../components/user/user-profile/user-profile.component';
import {ExploreComponent} from '../components/explore/explore.component';
import {EmailAuthComponent} from '../components/auth/email-auth/email-auth.component';
import {GameNightHomeComponent} from '../components/game-nights/game-night-home/game-night-home.component';
import {GameNightCollectionComponent} from '../components/game-nights/game-night-collection/game-night-collection.component';
import {GameNightMatchesContainer} from '../components/game-nights/game-night-matches/game-night-matches.component';
import {GameNightRegistrationComponent} from '../components/game-nights/game-night-registration/game-night-registration.component';
import {GameNightMembersComponent} from '../components/game-nights/game-night-members/game-night-members.component';
import {GameNightNavbarComponent} from '../components/game-nights/game-night-navbar/game-night-navbar.component';
import {GameNightComponent} from '../components/game-nights/game-night/game-night.component';
import {MyGameNightsComponent} from '../components/game-nights/my-game-nights/my-game-nights.component';
import {MatchDetailComponent} from '../components/matches/match-detail/match-detail.component';
import {ExploreGameNightListComponent} from '../components/explore/explore-game-night-list/explore-game-night-list.component';
import {GameDetailComponent} from '../components/collection/game-detail/game-detail.component';
import {GameRecommenderComponent} from '../components/collection/game-recommender/game-recommender.component';

export const appRoutes: Routes = [
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
        path: 'collection/recommender',
        component: GameRecommenderComponent
      },
      {
        path: 'collection/recommender/:gameId',
        component: GameDetailComponent
      },
      {
        path: 'collection/:gameId',
        component: GameDetailComponent
      },
      {
        path: 'matches',
        component: GameNightMatchesContainer
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