// Third-Party Dependencies
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import * as firebase from 'firebase';
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";

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

// Stores and Services
import {members} from './stores/members.store';
import {collection} from './stores/collection.store';
import {matches} from './stores/matches.store';
import {auth} from './stores/auth.store';
import {MembersService} from './services/members.service';
import {CollectionService} from './services/collection.service';
import {MatchService} from './services/match.service';
import {AuthService} from './services/auth.service';
import {EmailAuthComponent} from './components/auth/email-auth/email-auth.component';
import {AuthGuard} from './services/auth-guard.service';

// Private Keys
import {firebaseConfig} from './firebaseConfig';

// Route Definitions for NG Router
const appRoutes: Routes = [
  {path: 'matches', component: MatchesComponent},
  {path: 'members', component: MembersComponent},
  {path: 'collection', component: CollectionComponent},
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent
  },
  {path: 'email-auth', component: EmailAuthComponent},
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
    EmailAuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({members, collection, matches, auth}),
    AngularFireModule.initializeApp(firebaseConfig, authConfig)
  ],
  providers: [MembersService, CollectionService, MatchService, AuthService, AuthGuard],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
