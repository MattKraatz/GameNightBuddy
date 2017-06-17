import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class NavbarService {

  public MainNavbarExpanded: BehaviorSubject<boolean>;
  public GameNightNavbarExpanded: BehaviorSubject<boolean>;

  constructor() {
    this.MainNavbarExpanded = new BehaviorSubject(false);
    this.GameNightNavbarExpanded = new BehaviorSubject(false);
  }

  public toggleMainNavbar(){
    let bool = this.MainNavbarExpanded.value;
    // make sure the other navbar is hidden
    this.GameNightNavbarExpanded.next(false);
    this.MainNavbarExpanded.next(bool === false ? true : false);
  }

  public toggleGameNightNavbar(){
    let bool = this.GameNightNavbarExpanded.value;
    // make sure the other navbar is hidden
    this.MainNavbarExpanded.next(false);
    this.GameNightNavbarExpanded.next(bool === false ? true : false);
  }

}
