import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Game } from '../../../models/game.model';
import { Member } from '../../../models/member.model';
import { GameNight } from '../../../models/game-night.model';
import { Match } from '../../../models/match.model';
import { GameNightService } from '../../../services/game-night.service';
import {StatisticsService} from '../../../services/statistics.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class GameNightStatsComponent implements OnInit {

  night: GameNight;

  constructor(private gameNightService: GameNightService, private statsService: StatisticsService) {
    this.night = gameNightService.currentGameNight.value;
    this.calculateStats(this.night);
  }

  ngOnInit() {
  }

  calculateStats(night: GameNight) {
    const gameByMatchesDataLabel = '# of Matches';
    const gameByMatchesDataLength = 5;
    let matchCount = this.statsService.sortGamesByMatchesPlayed(night.Matches, gameByMatchesDataLength);

    // calculate line chart data, then push to public props
    let gameByMatchesDataPoints: Array<number> = new Array<number>();
    matchCount.forEach(group => {
      gameByMatchesDataPoints.push(group.count);
      this.gameByMatchesLabels.push(group.game.Name);
    });
    let gameByMatchesDataObject = {
      data: gameByMatchesDataPoints,
      label: gameByMatchesDataLabel
    };
    this.gameByMatchesData.push(gameByMatchesDataObject);
  }

  // GameByMatches Bar Chart
  public gameByMatchesData: Array<any> = new Array<any>();
  public gameByMatchesLabels: Array<string> = new Array<string>();
  public gameByMatchesOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    scales: {
      yAxes: [{
        ticks: {
          min: 0, // ignore negative steps
          beginAtZero: true,
          // ignore non-int steps
          callback: function(value, index, values) {
              if (Math.floor(value) === value) {
                  return value;
              }
          }
        }
      }]
    }
  };
  public gameByMatchesColors: any = new Array<any>({
    // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    fill: false
  });


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
