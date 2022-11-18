import { G } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import {
  ChartDataSets,
  ChartType,
  ChartOptions,
  RadialChartOptions,
  BarChartOptions,
} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-sensory-profile-page',
  templateUrl: './my-sensory-profile-page.component.html',
  styleUrls: ['./my-sensory-profile-page.component.css'],
})
export class MySensoryProfilePageComponent implements OnInit {
  ecarts_groupe_checked = false;
  ecarts_input_checked = true;
  ident_groupe_checked = false;
  ident_input_checked = false;

  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

  // modify(category: string, type: string) {
  //   if (category == 'ecarts') {
  //     if (type == 'input') {
  //       if (this.ecarts_input_checked) {
  //         this.radarChartData.push({
  //           data: [0, 0, 0, 0, 0],
  //           label: "Ligne de l'input",
  //           pointRadius: 0,
  //           backgroundColor: 'rgba(0,0,0,0.00)',
  //           borderColor: 'green',
  //           borderWidth: 1,
  //           pointBackgroundColor: 'green',
  //         });
  //       } else {
  //         let index = this.radarChartData.findIndex(
  //           (e) => e.label == "Ligne de l'input"
  //         );
  //         this.radarChartData.splice(index, 1);
  //       }
  //     } else {
  //       if (this.ecarts_groupe_checked) {
  //         this.radarChartData.push({
  //           data: this.groupValues,
  //           label: 'Valeurs du groupe',
  //           pointRadius: 2,
  //           backgroundColor: 'rgba(255,0,0,0.08)',
  //           borderColor: 'red',
  //           borderWidth: 1,
  //           pointBackgroundColor: 'red',
  //         });
  //       } else {
  //         let index = this.radarChartData.findIndex(
  //           (e) => e.label == 'Valeurs du groupe'
  //         );
  //         this.radarChartData.splice(index, 1);
  //       }
  //     }
  //   } else {
  //     if (type == 'input') {
  //     } else {
  //     }
  //   }
  // }
  allProfiles: boolean = false;
  constructor(public router: Router) {
    this.allProfiles = router.url == '/dashboard/sensory-profiles';
    // console.log(router.url);
    // console.log(this.allProfiles);
  }
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
    scale: {
      r: {
        angleLines: {
          color: 'red',
        },
      },
      ticks: {
        beginAtZero: true,
        max: 10,
        min: -10,
        stepSize: 1,
      },
    },
    plugins: {
      legend: {
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 10,
          },
        },
      },
    },
  };
  public radarChartLabels: Label[] = [
    'Sucré',
    'Umami',
    'Salé',
    'Acide',
    'Amer',
  ];
  mongo = environment.application.currentUser.mongoClient('Cluster0');
  Data = this.mongo.db('Data');
  user = environment.application.allUsers[sessionStorage.getItem('userId')];
  Analyses = this.Data.collection('Analyses');

  users = this.Data.collection('users');

  user_profile = [];
  // getProfile(id) {
  //   this.users.findOne({"id":id}).then((value)=>{
  //     // console.log(value[0])
  //     //console.log([value.sensory.tastes.sweet.quantification,value.sensory.tastes.umami.quantification,value.sensory.tastes.salty.quantification,value.sensory.tastes.sour.quantification,value.sensory.tastes.bitter.quantification])

  //   })
  // }
  user_identification;
  any;
  groupIdentification: any;
  groupValues: any;

  //   import { MongoClient } from 'mongodb';

  // /*
  //  * Requires the MongoDB Node.js Driver
  //  * https://mongodb.github.io/node-mongodb-native
  //  */

  // const agg = [
  //   {
  //     '$group': {
  //       '_id': 'Moyennes sensorielles',
  //       'sweet': {
  //         '$avg': '$sensory.tastes.sweet.quantification'
  //       },
  //       'salty': {
  //         '$avg': '$sensory.tastes.salty.quantification'
  //       },
  //       'bitter': {
  //         '$avg': '$sensory.tastes.bitter.quantification'
  //       },
  //       'sour': {
  //         '$avg': '$sensory.tastes.sour.quantification'
  //       },
  //       'umami': {
  //         '$avg': '$sensory.tastes.umami.quantification'
  //       }
  //     }
  //   }
  // ];

  // const client = await MongoClient.connect(
  //   '',
  //   { useNewUrlParser: true, useUnifiedTopology: true }
  // );
  // const coll = client.db('').collection('');
  // const cursor = coll.aggregate(agg);
  // const result = await cursor.toArray();
  // await client.close();
  toInit() {
    this.users.find({ roles: { $in: ['Jury'] } }).then((value) => {
      let n = value.length;
      let sweet = 0;
      let bitter = 0;
      let salty = 0;
      let sour = 0;
      let umami = 0;

      let sweet_id = 0;
      let bitter_id = 0;
      let salty_id = 0;
      let sour_id = 0;
      let umami_id = 0;

      let sweet_ind_id = 0;
      let bitter_ind_id = 0;
      let salty_ind_id = 0;
      let sour_ind_id = 0;
      let umami_ind_id = 0;
      this.barChartData.pop();
      value.forEach((us) => {
        sweet = sweet + us.sensory.tastes.sweet.quantification;
        umami = umami + us.sensory.tastes.umami.quantification;
        salty = salty + us.sensory.tastes.salty.quantification;
        sour = sour + us.sensory.tastes.sour.quantification;
        bitter = bitter + us.sensory.tastes.bitter.quantification;

        if (us.sensory.tastes.sweet.trials != 0) {
          sweet_id =
            sweet_id +
            (us.sensory.tastes.sweet.success * 100) /
              us.sensory.tastes.sweet.trials;
        }
        if (us.sensory.tastes.umami.trials != 0) {
          umami_id =
            umami_id +
            (us.sensory.tastes.umami.success * 100) /
              us.sensory.tastes.umami.trials;
        }
        if (us.sensory.tastes.salty.trials != 0) {
          salty_id =
            salty_id +
            (us.sensory.tastes.salty.success * 100) /
              us.sensory.tastes.salty.trials;
        }
        if (us.sensory.tastes.sour.trials != 0) {
          sour_id =
            sour_id +
            (us.sensory.tastes.sour.success * 100) /
              us.sensory.tastes.sour.trials;
        }
        if (us.sensory.tastes.bitter.trials != 0) {
          bitter_id =
            bitter_id +
            (us.sensory.tastes.bitter.success * 100) /
              us.sensory.tastes.bitter.trials;
        }

        //inutile
        // sweet_trials = sweet_trials + us.sensory.tastes.sweet.trials;
        // umami_trials = umami_trials + us.sensory.tastes.umami.trials;
        // salty_trials = salty_trials + us.sensory.tastes.salty.trials;
        // sour_trials = sour_trials + us.sensory.tastes.sour.trials;
        // bitter_trials = bitter_trials + us.sensory.tastes.bitter.trials;

        if (us.sensory.tastes.sweet.trials == 0) {
          sweet_ind_id = 0;
        } else {
          sweet_ind_id =
            (us.sensory.tastes.sweet.success * 100) /
            us.sensory.tastes.sweet.trials;
        }
        if (us.sensory.tastes.umami.trials == 0) {
          umami_ind_id = 0;
        } else {
          // console.log(us);
          umami_ind_id =
            (us.sensory.tastes.umami.success * 100) /
            us.sensory.tastes.umami.trials;
        }
        if (us.sensory.tastes.salty.trials == 0) {
          salty_ind_id = 0;
        } else {
          salty_ind_id =
            (us.sensory.tastes.salty.success * 100) /
            us.sensory.tastes.salty.trials;
        }
        if (us.sensory.tastes.sour.trials == 0) {
          sour_ind_id = 0;
        } else {
          sour_ind_id =
            (us.sensory.tastes.sour.success * 100) /
            us.sensory.tastes.sour.trials;
        }
        if (us.sensory.tastes.bitter.trials == 0) {
          bitter_ind_id = 0;
        } else {
          bitter_ind_id =
            (us.sensory.tastes.bitter.success * 100) /
            us.sensory.tastes.bitter.trials;
        }

        this.user_identification = [
          sweet_ind_id,
          umami_ind_id,
          salty_ind_id,
          sour_ind_id,
          bitter_ind_id,
        ];
        if (!this.allProfiles) {
          if (us.id == this.user.id) {
            // console.log(value[0])
            this.user_profile = [
              us.sensory.tastes.sweet.quantification,
              us.sensory.tastes.umami.quantification,
              us.sensory.tastes.salty.quantification,
              us.sensory.tastes.sour.quantification,
              us.sensory.tastes.bitter.quantification,
            ];
            this.radarChartData.push({
              data: this.user_profile,
              label: 'Profil personnel',
              pointRadius: 5,
              backgroundColor: 'rgba(0,0,255,0.28)',
              pointBackgroundColor: 'blue',
            });

            this.barChartData.push({
              data: this.user_identification,
              label: 'Profil personnel',
              backgroundColor: 'rgba(0,0,255,0.28)',
              pointBackgroundColor: 'blue',
            });
          }
        } else {
          // console.log(value[0])
          this.user_profile = [
            us.sensory.tastes.sweet.quantification,
            us.sensory.tastes.umami.quantification,
            us.sensory.tastes.salty.quantification,
            us.sensory.tastes.sour.quantification,
            us.sensory.tastes.bitter.quantification,
          ];
          let color = this.random_rgba();
          this.radarChartData.push({
            data: this.user_profile,
            label: us.username,
            pointRadius: 3,
            backgroundColor: color,
            pointBackgroundColor: color,
          });

          this.barChartData.push({
            data: this.user_identification,
            label: us.username,
            backgroundColor: color,
            pointBackgroundColor: color,
          });
        }
        this.groupValues = [
          sweet / n,
          umami / n,
          salty / n,
          sour / n,
          bitter / n,
        ];

        this.groupIdentification = [
          sweet_id / n,
          umami_id / n,
          salty_id / n,
          sour_id / n,
          bitter_id / n,
        ];
      });
      this.radarChartData.push({
        data: this.groupValues,
        label: 'Valeurs du groupe',
        pointRadius: 2,
        backgroundColor: 'rgba(255,0,0,0.08)',
        borderColor: 'red',
        borderWidth: 1,
        pointBackgroundColor: 'red',
      });
      this.barChartData.push({
        data: this.groupIdentification,
        label: 'Valeurs du groupe',
        backgroundColor: 'rgba(255,0,0,0.08)',
        borderColor: 'red',
        borderWidth: 1,
      });
    });

    // this.users.find({}).then((value)=>{

    // })
  }

  // public radarChartData: ChartDataSets[] = [
  //   { data: this.user_profile, label: 'Profil personnel',pointRadius : 5 },
  //   { data: [8, 8, 1, 6, 6], label: 'Moyenne du groupe',pointRadius : 5 }

  // ];
  random_rgba() {
    var o = Math.round,
      r = Math.random,
      s = 155;
    return (
      'rgba(' +
      o(r() * s + 100) +
      ',' +
      o(r() * s + 100) +
      ',' +
      o(r() * s + 100) +
      ',' +
      0.3 +
      ')'
    );
  }
  public radarChartData: ChartDataSets[] = [
    {
      data: [0, 0, 0, 0, 0],
      label: "Ligne de l'input",
      pointRadius: 0,
      backgroundColor: 'rgba(0,0,0,0.00)',
      borderColor: 'green',
      borderWidth: 1,
      pointBackgroundColor: 'green',
    },
  ];
  public radarChartType: ChartType = 'radar';

  public radarChartColors: Color[] = [
    // {
    //   // borderColor: 'black',
    //   backgroundColor: 'rgba(0,0,255,0.28)',
    //   pointBackgroundColor: 'blue',
    // },
    // {
    //   // borderColor: 'black',
    //   backgroundColor: 'rgba(0,0,0,0.00)',
    //   borderColor: 'green',
    //   borderWidth: 1,
    //   pointBackgroundColor: 'green',
    // },
  ];

  //___________

  public barChartOptions: BarChartOptions = {
    responsive: true,
    type: 'bar',

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
  };

  public barChartLabels: Label[] = ['Sucré', 'Umami', 'Salé', 'Acide', 'Amer'];
  public barChartData: ChartDataSets[] = [{ data: [], label: '' }];
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

  ngOnInit() {
    //this.user_profile = this.getProfile(this.user.id)
    //console.log(this.getProfile(environment.user.id))
    this.toInit();
  }
}
