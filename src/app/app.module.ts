// Third-Party Dependencies
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import * as firebase from 'firebase';

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

// Stores and Services
import {members} from './stores/members.store';
import {collection} from './stores/collection.store';
import {matches} from './stores/matches.store';
import {MembersService} from './services/members.service';
import {CollectionService} from './services/collection.service';

// Private Keys

// Route Definitions for NG Router
const appRoutes: Routes = [
  {path: 'matches', component: MatchesComponent},
  {path: 'members', component: MembersComponent},
  {path: 'collection', component: CollectionComponent},
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

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
    GameFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({members, collection, matches})
  ],
  providers: [MembersService, CollectionService],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
