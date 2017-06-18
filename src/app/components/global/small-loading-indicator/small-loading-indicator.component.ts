import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'small-loading-indicator',
  template: '<img src="assets/default-loading-spinner.svg" class="small-loading-indicator" alt="logo" />',
  styleUrls: ['./small-loading-indicator.component.css']
})
export class SmallLoadingIndicatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
