import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import ObjectID from 'bson-objectid';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MainPageComponent } from '../../main-page.component';
import { BadgeDataService } from '../../badge-data.service';
// import {RadioButtonComponent} from '/radio-button/radio-button'

export interface Analysis {
  _id: string;
  type: string;
  active: boolean;
  name: string;
  validity: any;
  users: any;
  fields: any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [BadgeDataService],
})
export class FormComponent implements OnInit {
  @Input() preview_analysis: any;
  @Input() ButtonDisabled: boolean = false;
  @Input() completedForm: any = [null];

  answerList = [];

  addAnswer(newAnswer: any, fieldNumber) {
    //this.answerList.push(newAnswer);
    this.answerList[fieldNumber] = newAnswer;
    ////console.log(this.answerList)
  }
  champ_radio_entrainement(label) {
    return {
      format: {
        name: 'radio button',
        choices: ['Sucré', 'Salé', 'Umami', 'Acide', 'Amer', 'Aucun'],
      },
      label: label,
    };
  }
  champ_slider_entrainement() {
    return {
      format: {
        name: 'slider',
        min: 1,
        max: 10,
      },
      // label : label
    };
  }

  navigateToFoo(id) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate(['dashboard/my-analysis/view'], {
      // relativeTo: this.route,
      queryParams: {
        id: id,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false,
      // do not trigger navigation
    });
  }

  app = environment.application;
  //user : any;
  //mongo : any;
  //Analyses : any;
  current_id: string;
  analysis: Analysis[];
  title: string;
  currentItem = '';
  current_analysis: any;
  answers: any;
  finished = false;
  // ButtonDisabled: boolean;

  Group: FormGroup = new FormGroup({
    Array: new FormArray([]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private main: MainPageComponent
  ) {}
  id: string;
  mongo = environment.application.currentUser.mongoClient('Cluster0');
  Data = this.mongo.db('Data');
  user = environment.application.allUsers[sessionStorage.getItem('userId')];
  Analyses = this.Data.collection('Analyses');
  jury = sessionStorage.getItem('role') == 'Jury';
  AnalysisAnswer(id) {
    this.current_id = id;
    ////console.log(id)
    // //console.log(this.ButtonDisabled);
    if (id == undefined) {
      ////console.log(this.preview_analysis)

      ////console.log(this.ButtonDisabled);
      this.current_analysis = this.preview_analysis.fields;
      this.title = this.preview_analysis.name;
      let index = 0;
      this.current_analysis.forEach(function (field) {
        // signinForm = new FormGroup({
        //   email: new FormControl('', Validators.required),
        //   password: new FormControl('', Validators.required),
        // });
        //this.Group.addControl(index.toString(),['', Validators.required]);

        index = index + 1;
      });
    } else {
      // //console.log(id);
      this.Analyses.find({ _id: ObjectID(id) }).then((value) => {
        // //console.log(value);
        this.current_analysis = value[0].fields;
        this.title = value[0].name;
        // //console.log('je ne plante pas');
        let index = 0;
        this.current_analysis.forEach(function (field) {
          // signinForm = new FormGroup({
          //   email: new FormControl('', Validators.required),
          //   password: new FormControl('', Validators.required),
          // });
          //this.Group.addControl(index.toString(),['', Validators.required]);

          index = index + 1;
        });
      });
    }
    //this.answering=!this.answering
  }

  async sendAnswer() {
    // this.answers.insertOne({"user_id":this.user.id,"analysis_id":this.id,"fields":this.answerList,time:Date().toLocaleString()}).then((result)=>{

    this.Analyses.updateOne(
      { _id: ObjectID(this.id) },
      {
        $push: {
          answered: {
            id: this.user.id,
            fields: this.answerList,
            time: Date().toLocaleString(),
          },
        },
      }
    ).then((value) => {
      const mongo = environment.application.currentUser.mongoClient('Cluster0');
      const Data = mongo.db('Data');
      const users = Data.collection('users');
      const Analyses = Data.collection('Analyses');
      var tastes = {
        sweet: {
          trials: 0,
          success: 0,
          quantification: 0.0,
        },
        bitter: {
          trials: 0,
          success: 0,
          quantification: 0.0,
        },
        salty: {
          trials: 0,
          success: 0,
          quantification: 0.0,
        },
        umami: {
          trials: 0,
          success: 0,
          quantification: 0.0,
        },
        sour: {
          trials: 0,
          success: 0,
          quantification: 0.0,
        },
      };
      Analyses.aggregate([
        {
          $match: {
            'fields.format.name': 'training',
            $expr: {
              $in: [this.user.id, '$answered.id'],
            },
          },
        },
        {
          $set: {
            'answered.fields.input_taste': '$fields.format.sensory_taste',
            'answered.fields.input_intensity':
              '$fields.format.sensory_intensity',
          },
        },
        {
          $project: {
            name: true,
            results: {
              $filter: {
                input: '$answered',
                as: 'answered',
                cond: {
                  $eq: [this.user.id, '$$answered.id'],
                },
              },
            },
          },
        },
        {
          $set: {
            results: '$results.fields',
          },
        },
        {
          $unwind: {
            path: '$results',
          },
        },
      ]).then((value) => {
        for (
          //toutes les analyses
          let analyse = 0;
          analyse < value.length;
          analyse++
        ) {
          for (
            //toutes les analyses
            let champ = 0;
            champ < value[analyse]['results'].length;
            champ++
          ) {
            // //console.log(value[analyse]['results']);
            //console.log("nom de l'analyse : ", value[analyse]);
            //console.log('champ :', champ);
            let inputIntensity =
              value[analyse]['results'][champ]['input_intensity'][champ];
            let inputTaste =
              value[analyse]['results'][champ]['input_taste'][champ];
            //console.log('inputTaste :', inputTaste);
            let outputIntensity =
              value[analyse]['results'][champ]['sensory_intensity'];

            let outputTaste = value[analyse]['results'][champ]['sensory_taste'];
            //console.log('outputTaste :', outputTaste);
            if (inputTaste != 'none' && inputTaste != undefined) {
              tastes[inputTaste]['trials'] = tastes[inputTaste]['trials'] + 1;
              if (inputTaste == outputTaste) {
                tastes[inputTaste]['success'] =
                  tastes[inputTaste]['success'] + 1;
                tastes[inputTaste]['quantification'] =
                  tastes[inputTaste]['quantification'] +
                  outputIntensity -
                  inputIntensity;
              }
            }
          }
        }
        // //console.log(tastes);
        Object.keys(tastes).forEach((taste) => {
          //console.log('tastes :', tastes);
          //console.log('taste :', taste);
          if (tastes[taste]['trials'] != 0) {
            tastes[taste]['quantification'] =
              tastes[taste]['quantification'] / tastes[taste]['trials'];
          }
        });
        // //console.log(tastes);
        users.updateOne(
          { _id: ObjectID(this.user.id) },
          { $set: { 'sensory.tastes': tastes } }
        );
      });

      this.main.supOneAnalysis();
      this.finished = true;
    });

    // })
  }
  ngOnInit() {
    // this.ButtonDisabled = false;
    ////console.log(this.ButtonDisabled)
    this.route.queryParams.subscribe((params) => {
      ////console.log(params); // { orderby: "price" }
      this.id = params.id;
      this.AnalysisAnswer(this.id);
      ////console.log(this.id); // price
    });
  }
}
