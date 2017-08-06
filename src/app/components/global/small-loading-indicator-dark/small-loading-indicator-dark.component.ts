import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'small-loading-indicator-dark',
  template: '<img src="assets/default-loading-spinner-dark.svg" class="small-loading-indicator-dark" alt="loading" />',
  styleUrls: ['./small-loading-indicator-dark.component.css']
})
export class SmallLoadingIndicatorDarkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
