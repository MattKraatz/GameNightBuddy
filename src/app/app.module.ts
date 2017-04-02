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
import { MemberFormComponent } from './components/members/member-form/member-form.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';

// Stores and Services
import {members} from './stores/members.store';
import {MembersService} from './services/members.service';

// Private Keys

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
    MemberListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({members})
  ],
  providers: [MembersService],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
