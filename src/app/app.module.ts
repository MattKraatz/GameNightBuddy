// Third-Party Dependencies
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import * as $ from 'jquery';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from 'angularfire2/auth';
import {NgxPaginationModule} from 'ngx-pagination';
import {StarRatingModule} from 'angular-star-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

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
import {LoginGuard} from './services/guards/login-guard.service';
import {AuthGuard} from './services/guards/auth-guard.service';
import {GameNightService} from './services/game-night.service';
import {GameNightResolver} from './services/resolvers/game-night-resolver.service';
import {ProfileCompleteGuard} from './services/guards/profile-complete-guard.service';
import {NavbarService} from './services/navbar.service';

// Routes
import {appRoutes} from './constants/routes';

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
import {EmailAuthComponent} from './components/auth/email-auth/email-auth.component';
import {UserProfileComponent} from './components/user/user-profile/user-profile.component';
import {ExploreComponent} from './components/explore/explore.component';
import {GameNightListComponent} from './components/game-nights/game-night-list/game-night-list.component';
import {GameNightHomeComponent} from './components/game-nights/game-night-home/game-night-home.component';
import {GameNightCollectionComponent} from './components/game-nights/game-night-collection/game-night-collection.component';
import {GameNightMatchesContainer} from './components/game-nights/game-night-matches/game-night-matches.component';
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
import {SmallLoadingIndicatorDarkComponent} from './components/global/small-loading-indicator-dark/small-loading-indicator-dark.component';
import {MatchInfoComponent} from './components/matches/match-info/match-info.component';
import {GameDetailComponent} from './components/collection/game-detail/game-detail.component';
import {GameInfoComponent} from './components/collection/game-info/game-info.component';
import {GameRecommenderComponent} from './components/collection/game-recommender/game-recommender.component';
import {ActivityListComponent} from './components/game-nights/activity-list/activity-list.component';
import {AboutComponent} from './component/about/about.component';
import {PrivacyComponent} from './component/privacy/privacy.component';
import {ContactComponent} from './component/contact/contact.component';
import {GameNightStatsComponent} from './components/game-nights/game-night-stats/game-night-stats.component';

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
    GameNightMatchesContainer,
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
    SmallLoadingIndicatorDarkComponent,
    MatchInfoComponent,
    GameDetailComponent,
    GameInfoComponent,
    GameRecommenderComponent,
    ActivityListComponent,
    AboutComponent,
    PrivacyComponent,
    ContactComponent,
    GameNightStatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({user, collection, matches, gameNight, myGameNights, otherGameNights}),
    AngularFireModule.initializeApp(firebaseConfig),
    NgxPaginationModule,
    StarRatingModule.forRoot(),
    NgbModule.forRoot()
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
    NavbarService,
    AngularFireAuth
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
