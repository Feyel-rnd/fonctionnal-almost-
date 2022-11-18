import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import {
  ChartDataSets,
  ChartType,
  ChartOptions,
  RadialChartOptions,
} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };
  constructor() {}
  presenceData = [];
  list = [
    { username: null, score: '' },
    { username: null, score: '' },
    { username: null, score: '' },
  ];
  ngOnInit() {
    const app = environment.application;
    const user = app.allUsers[sessionStorage.getItem('userId')];

    const mongo = user.mongoClient('Cluster0');
    const users = mongo.db('Data').collection('users');
    const Analyses = mongo.db('Data').collection('Analyses');
    users
      .aggregate([
        {
          $match: {
            roles: {
              $in: ['Jury'],
            },
          },
        },
        {
          $match: {
            roles: {
              $nin: ['Invité', 'Admin', 'Observateur'],
            },
          },
        },
        {
          $project: {
            _id: false,
            username: true,
            ranking_sweet: {
              $cond: [
                {
                  $in: [0, ['$sensory.tastes.sweet.trials']],
                },
                'noData',
                {
                  $subtract: [
                    10,
                    {
                      $abs: '$sensory.tastes.sweet.quantification',
                    },
                  ],
                },
              ],
            },
            ranking_bitter: {
              $cond: [
                {
                  $in: [0, ['$sensory.tastes.bitter.trials']],
                },
                'noData',
                {
                  $subtract: [
                    10,
                    {
                      $abs: '$sensory.tastes.bitter.quantification',
                    },
                  ],
                },
              ],
            },
            ranking_sour: {
              $cond: [
                {
                  $in: [0, ['$sensory.tastes.sour.trials']],
                },
                'noData',
                {
                  $subtract: [
                    10,
                    {
                      $abs: '$sensory.tastes.sour.quantification',
                    },
                  ],
                },
              ],
            },
            ranking_salty: {
              $cond: [
                {
                  $in: [0, ['$sensory.tastes.salty.trials']],
                },
                'noData',
                {
                  $subtract: [
                    10,
                    {
                      $abs: '$sensory.tastes.salty.quantification',
                    },
                  ],
                },
              ],
            },
            ranking_umami: {
              $cond: [
                {
                  $in: [0, ['$sensory.tastes.umami.trials']],
                },
                'noData',
                {
                  $subtract: [
                    10,
                    {
                      $abs: '$sensory.tastes.umami.quantification',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $project: {
            username: true,
            score: {
              $avg: [
                '$ranking_sweet',
                '$ranking_salty',
                '$ranking_bitter',
                '$ranking_umami',
                '$ranking_sour',
              ],
            },
          },
        },
        {
          $sort: {
            score: -1,
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            score: '$score',
            username: {
              $cond: [
                {
                  $in: ['$score', [null]],
                },
                null,
                '$username',
              ],
            },
          },
        },
      ])
      .then((result) => {
        // this.list = result;
        result.forEach((winner) => {
          let index = result.indexOf(winner);
          if (winner.username != null) {
            this.list[index] = winner;
          }
        });
      });

    Analyses.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'true',
          foreignField: 'true',
          as: 'total_users',
        },
      },
      {
        $project: {
          name: true,
          registered: {
            $size: '$registered',
          },
          answered: {
            $size: '$answered',
          },
          total_users: {
            $size: '$total_users',
          },
        },
      },
      {
        $project: {
          name: true,
          answered: true,
          registered: true,
          total_users: true,
          valid: {
            $and: [
              {
                $gt: ['$answered', 0],
              },
              {
                $gt: ['$registered', 0],
              },
            ],
          },
        },
      },
      {
        $match: {
          valid: true,
        },
      },
      {
        $project: {
          name: true,
          total_users_presence_rate: {
            $divide: ['$answered', '$total_users'],
          },
          registration_rate: {
            $divide: ['$registered', '$total_users'],
          },
          presence_after_registration_rate: {
            $divide: ['$answered', '$registered'],
          },
        },
      },
      {
        $group: {
          _id: null,
          total_users_presence_rate: {
            $avg: '$total_users_presence_rate',
          },
          registration_rate: {
            $avg: '$registration_rate',
          },
          presence_after_registration_rate: {
            $avg: '$presence_after_registration_rate',
          },
        },
      },
    ]).then((result) => {
      // console.log(result);
      //this.presenceData = result;
      if (result[0] != undefined) {
        this.barChartData.pop();
        var color = '';
        // result[0].registration_rate = 0.95;
        // result[0].presence_after_registration_rate = 0.9;
        // result[0].total_users_presence_rate = 0.81;
        this.barChartData.push({
          data: [result[0].registration_rate * 100],
          label: "Taux d'inscription",
        });

        color =
          'rgb(' +
          Math.round(this.colorRed(result[0].registration_rate)) +
          ',' +
          Math.round(this.colorGreen(result[0].registration_rate)) +
          ',0)';
        // console.log(color);
        this.barChartColors.push({
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
        });
        color =
          'rgb(' +
          Math.round(
            this.colorRed(result[0].presence_after_registration_rate)
          ) +
          ',' +
          Math.round(
            this.colorGreen(result[0].presence_after_registration_rate)
          ) +
          ',0)';
        this.barChartData.push({
          data: [result[0].presence_after_registration_rate * 100],
          label: 'Présence après inscription',
        });
        this.barChartColors.push({
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
        });
        color =
          'rgb(' +
          Math.round(this.colorRed(result[0].total_users_presence_rate)) +
          ',' +
          Math.round(this.colorGreen(result[0].total_users_presence_rate)) +
          ',0)';
        this.barChartData.push({
          data: [result[0].total_users_presence_rate * 100],
          label: 'Présence totale',
        });
        this.barChartColors.push({
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
        });
      }
    });
  }
  colorRed(x: number) {
    const goodValue = 0.75;
    if (x <= goodValue) {
      return 255;
    } else {
      let gradient = 95;
      return gradient * (1 - x) + (255 - gradient);
    }
  }

  colorGreen(x) {
    const goodValue = 0.75;
    if (x <= goodValue) {
      return 255 * goodValue * ((1 / goodValue) * x);
    } else {
      return 255 * x;
    }
  }

  public barChartOptions: ChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
            callback: function (tick) {
              return tick.toString() + '%';
            },
          },
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
    // legend: {
    //   display: false,
    // },
    // tooltips: {
    //   callbacks: {
    //     label: function (tooltipItem) {
    //       return tooltipItem.yLabel;
    //     },
    //   },
    // },
  };
  public barChartLabels: Label[] = [' '];
  public barChartData: ChartDataSets[] = [
    { data: [], label: '' },
    // { data: [], label: "Taux d'inscription" },
    // { data: [], label: 'Présence après inscription' },
    // { data: [], label: 'Présence totale' },
  ];
  public barChartType: ChartType = 'bar';

  public barChartColors: Color[] = [
    // {
    //   // borderColor: 'black',
    //   backgroundColor: 'rgba(0,0,255,0.28)',
    //   pointBackgroundColor: 'blue',
    // },
    // {
    //   // borderColor: 'black',
    //   backgroundColor: 'rgba(0,255,0,0.48)',
    //   pointBackgroundColor: 'green',
    // },
  ];
}
