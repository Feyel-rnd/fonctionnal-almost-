import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatabaseService } from '../../database.service';
import {
  ChartDataSets,
  ChartType,
  ChartOptions,
  RadialChartOptions,
  BarChartOptions,
} from 'chart.js';
import { Color, Label } from 'ng2-charts';
import ObjectID from 'bson-objectid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface field {
  label: string;
  format: any;
  required: boolean;
}

export interface sensoryForm {
  type: string;
  active: boolean;
  fields: field[];
  name: string;
  valid_on: string;
  invited: {
    users: Array<any>;
    roles: Array<string>;
  };
  registered: Array<any>;
  answered: Array<any>;
}

@Component({
  selector: 'app-analysis-admin-view',
  templateUrl: './analysis-admin-view.component.html',
  styleUrls: ['./analysis-admin-view.component.css'],
  providers: [DatabaseService],
})
export class AnalysisAdminViewComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public data: DatabaseService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  defaultIndex = 0;
  id: string;
  app = environment.application;
  mongo: any;
  user: any;
  Analyses: any;
  analyse: any = { name: '', type: '', answered: [], fields: [], valid_on: '' };
  chartOptionsList = [];
  chartLabelsList = [];
  chartDataList = [];
  chartColorsList = [];
  numberOfAnswers = 0;
  individualAnswersEnabled = false;
  printPDF() {
    const domElement = document.getElementById('barChart');
    html2canvas(domElement, {
      onclone: (document) => {
        //document.getElementById('print-button').style.visibility = 'hidden';
      },
    }).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      var t = 150;
      pdf.addImage(img, 'JPEG', 0, 0, t, t * 0.9);
      pdf.save('your-filename.pdf');
    });
  }

  openDialog(user, analyse): void {
    //console.log(analyseID)
    const dialogRef = this.dialog.open(DialogDeleteAnswer, {
      width: '360px',
      data: { _id: user._id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      //console.log(result)
      if (result) {
        this.openSnackBar('Réponse supprimée !', '');
        //this.refreshDatasource(this.dataSource, analyse);
        this.removeUserFromAnalysis(user, analyse);
        //console.log(analyse);
        // this.length = this.sortedData.length;
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
  async removeUserFromAnalysis(user, analysis) {
    // console.log(analysis);
    analysis.users.splice(analysis.users.indexOf(user), 1); //front
    analysis.answered.splice(
      analysis.answered.findIndex((e) => e.id == user.id),
      1
    ); //front
    await this.Analyses.updateOne(
      { _id: analysis._id },
      { $pull: { answered: { id: user.id } } }
    ); //back
    this.numberOfAnswers = this.analyse.answered.length;
    if (this.numberOfAnswers != 0) {
      this.individualAnswersEnabled = true;
    } else {
      this.individualAnswersEnabled = false;
      this.defaultIndex = 0;
    }
    this.refreshData();
    // console.log(analysis);
  }

  refreshData() {
    this.chartOptionsList = [];
    this.chartLabelsList = [];
    this.chartDataList = [];
    this.chartColorsList = [];
    this.Analyses.aggregate([
      {
        $match: {
          _id: ObjectID(this.id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'answered.id',
          foreignField: 'id',
          as: 'users',
        },
      },
    ]).then((_analyse) => {
      // console.log(_analyse[0]);
      this.analyse = _analyse[0];
      this.analyse.fields.forEach((field) => {
        if (field.format.name == 'radio button') {
          this.chartLabelsList.push(['Réponses']); //catégorie unique sur l'axe X
          this.chartDataList.push(
            this.compileRadioAnswers(
              this.analyse,
              this.analyse.fields.indexOf(field)
            )
          ); //on ajoute la data compilée
        } else if (field.format.name == 'slider') {
          this.chartLabelsList.push(
            this.compileSliderAnswers(
              this.analyse,
              this.analyse.fields.indexOf(field)
            )[1]
          );
          this.chartDataList.push(
            this.compileSliderAnswers(
              this.analyse,
              this.analyse.fields.indexOf(field)
            )[0]
          ); //on ajoute la data compilée
        } else if (field.format.name == 'input_text') {
          this.chartLabelsList.push(['Réponses']);
          this.chartDataList.push([{ data: [], label: 'vide' }]);
        } else if (field.format.name == 'training') {
          // console.log(field.format);

          this.chartLabelsList.push(
            this.compileTrainingAnswers(
              this.analyse,
              this.analyse.fields.indexOf(field)
            )[1]
          );
          // this.compileTrainingAnswers(
          //   this.analyse,
          //   this.analyse.fields.indexOf(field)
          // )[0].forEach((note) => {
          //   console.log(note);
          //   this.chartDataList.push([
          //     { data: [note], label: 'Répartition des notes' },
          //   ]);
          // });
          this.chartDataList.push(
            this.compileTrainingAnswers(
              this.analyse,
              this.analyse.fields.indexOf(field)
            )[0]
          );
          // this.chartDataList.push([{ data: [], label: 'vide' }]);
        }
      });
      // console.log(this.analyse);
      this.numberOfAnswers = this.analyse.answered.length;
      if (this.numberOfAnswers != 0) {
        this.individualAnswersEnabled = true;
      }
    });
  }
  ngOnInit() {
    // FONCTIONNE
    // const doc = new jsPDF();
    // doc.text('Hello world!', 10, 10);
    // doc.save('a4.pdf');
    //////////////////////

    /////////////////
    this.route.queryParams.subscribe((params) => {
      //console.log(params); // { orderby: "price" }
      this.id = params.id;
    });
    this.user = this.app.allUsers[sessionStorage.getItem('userId')];
    this.mongo = this.user.mongoClient('Cluster0');
    const Data = this.mongo.db('Data');
    this.Analyses = Data.collection('Analyses');
    const users = Data.collection('users');
    this.refreshData();
  }
  // async getUsernameById(_id) {
  //   const Data = this.mongo.db('Data');
  //   const users = Data.collection('users');
  //   let result = await users.findOne({ _id: ObjectID(_id) });
  //   return result.username;
  // }
  public barChartOptions_radio_button: BarChartOptions = {
    responsive: true,
    type: 'bar',

    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            stepSize: 1,
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

  public barChartOptions: BarChartOptions = {
    responsive: true,
    type: 'bar',

    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            stepSize: 1,
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

  compileTrainingAnswers(analyse, fieldIndex) {
    var sliderData = [];
    var tableau = [];
    var echecs = 0;
    for (let i = 0; i <= 10; i++) {
      sliderData.push(0);
      tableau.push(i);
    }

    analyse.answered.forEach((user) => {
      // console.log('analyse (', fieldIndex, '): ', analyse);
      // console.log('user :', user);
      if (
        analyse.fields[fieldIndex].format.sensory_taste ==
        user.fields[fieldIndex].sensory_taste
      ) {
        // console.log('réussite');
        // console.log(fieldIndex);
        sliderData[fieldIndex] = sliderData[fieldIndex] + 1;
      } else {
        echecs = echecs + 1;
      }
    });
    // console.log(sliderData);
    var color = '';
    // var tableau = ['0','1','2','3','4','5','6','7','8','9','10'];
    // if (analyse.fields[fieldIndex].format.right_answers == undefined) {
    //   analyse.fields[fieldIndex].format.right_answers = [];
    // }
    tableau.forEach((availableChoice) => {
      //complétion des réponses manquantes avec mise en couleur de la bonne réponse
      // console.log(analyse.fields[fieldIndex].format.sensory_intensity);
      if (
        Math.abs(
          availableChoice - analyse.fields[fieldIndex].format.sensory_intensity
        ) <= 1
      ) {
        tableau[tableau.indexOf(availableChoice)] = availableChoice
          .toString()
          .concat('*');
      }
    });
    tableau = ['Echecs'].concat(tableau);
    sliderData = [echecs].concat(sliderData);
    return [[{ data: sliderData, label: 'Répartition des notes' }], tableau];
  }

  compileSliderAnswers(analyse, fieldIndex) {
    var sliderData = [];
    var tableau = [];
    for (
      let i = +analyse.fields[fieldIndex].format.min;
      i <= analyse.fields[fieldIndex].format.max;
      i++
    ) {
      sliderData.push(0);
      tableau.push(i);
    }

    var answers = {};
    var listToRender = [];
    analyse.answered.forEach((user) => {
      sliderData[
        user.fields[fieldIndex] - analyse.fields[fieldIndex].format.min
      ] =
        sliderData[
          user.fields[fieldIndex] - analyse.fields[fieldIndex].format.min
        ] + 1;
    });

    var color = '';
    // var tableau = ['0','1','2','3','4','5','6','7','8','9','10'];
    if (analyse.fields[fieldIndex].format.right_answers == undefined) {
      analyse.fields[fieldIndex].format.right_answers = [];
    }
    tableau.forEach((availableChoice) => {
      //complétion des réponses manquantes avec mise en couleur de la bonne réponse

      if (
        analyse.fields[fieldIndex].format.right_answers.includes(
          availableChoice
        )
      ) {
        color = 'rgb(50,215,50)';
      } else {
        color = 'rgb(215,50,50)';
      }

      // listToRender.push({
      //   data: [],
      //   // borderColor: color,
      //   // hoverBorderColor: color,
      //   // hoverBackgroundColor: color,
      //   // backgroundColor: color,
      // });
    });
    // console.log(tableau);
    return [[{ data: sliderData, label: 'Répartition des notes' }], tableau];
  }

  compileTextAnswers(analyse, fieldIndex) {
    //ne marche pas pour training
    var answers = {};
    var listToRender = [];
    analyse.answered.forEach((user) => {
      if (answers[user.fields[fieldIndex]] != undefined) {
        answers[user.fields[fieldIndex]] = answers[user.fields[fieldIndex]] + 1;
      } else {
        answers[user.fields[fieldIndex]] = 1;
      }
    });

    var color = '';
    Object.keys(answers).forEach((choice) => {
      listToRender.push({
        data: [answers[choice]],
        label: choice,
        borderColor: color,
        hoverBorderColor: color,
        hoverBackgroundColor: color,
        backgroundColor: color,
      });
    });

    // console.log(listToRender);
    return listToRender;
  }

  compileRadioAnswers(analyse, fieldIndex) {
    //ne marche pas pour training
    var answers = {};
    var listToRender = [];

    analyse.answered.forEach((user) => {
      if (answers[user.fields[fieldIndex]] != undefined) {
        answers[user.fields[fieldIndex]] = answers[user.fields[fieldIndex]] + 1;
      } else {
        answers[user.fields[fieldIndex]] = 1;
      }
    });
    if (analyse.fields[fieldIndex].format.right_answers == undefined) {
      analyse.fields[fieldIndex].format.right_answers = [];
    }
    var color = '';
    Object.keys(answers).forEach((choice) => {
      if (analyse.fields[fieldIndex].format.right_answers.includes(choice)) {
        color = 'rgb(50,215,50)';
      } else {
        color = 'rgb(215,50,50)';
      }

      listToRender.push({
        data: [answers[choice]],
        label: choice,
        borderColor: color,
        hoverBorderColor: color,
        hoverBackgroundColor: color,
        backgroundColor: color,
      });
    });
    if (analyse.fields[fieldIndex].format.right_answers == undefined) {
      analyse.fields[fieldIndex].format.right_answers = [];
    }
    analyse.fields[fieldIndex].format.choices.forEach((availableChoice) => {
      //complétion des réponses manquantes avec mise en couleur de la bonne réponse

      if (
        analyse.fields[fieldIndex].format.right_answers.includes(
          availableChoice
        )
      ) {
        color = 'rgb(50,215,50)';
      } else {
        color = 'rgb(215,50,50)';
      }
      if (answers[availableChoice] == undefined) {
        listToRender.push({
          data: [],
          label: availableChoice,
          borderColor: color,
          hoverBorderColor: color,
          hoverBackgroundColor: color,
          backgroundColor: color,
        });
      }
    });
    // console.log(listToRender);
    return listToRender;
  }
  public barChartLabels: Label[] = [];
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
}
@Component({
  selector: 'dialog-delete-answer',
  templateUrl: 'dialog-delete-answer.html',
})
export class DialogDeleteAnswer implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogDeleteAnswer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  user: any;
  mongo: any;
  users: any;
  app = environment.application;
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  ngOnInit() {
    this.user = this.app.allUsers[sessionStorage.getItem('userId')];

    // console.log(this.analysis.length);
    this.mongo = this.user.mongoClient('Cluster0');
    const Data = this.mongo.db('Data');
    this.users = Data.collection('users');
  }

  onNoClick(val: boolean): void {
    //console.log(this.data._id)
    if (val) {
      this.dialogRef.close(true);
    }
    //console.log(val)
    else {
      this.openSnackBar('Opération annulée.', '');
      this.dialogRef.close(false);
    }
  }
}
