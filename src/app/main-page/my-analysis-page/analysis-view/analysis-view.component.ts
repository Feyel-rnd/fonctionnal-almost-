import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ObjectID from 'bson-objectid';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-analysis-view',
  templateUrl: './analysis-view.component.html',
  styleUrls: ['./analysis-view.component.css'],
})
export class AnalysisViewComponent implements OnInit {
  @Input() analysisId: string;
  @Input() userId: string;
  constructor(private router: Router, private route: ActivatedRoute) {}
  // currentId=sessionStorage.getItem('userId')
  FormFields = [];
  user: any;
  mongo: any;
  Analyses: any;
  app = environment.application;
  answers: any = { fields: [] };
  ButtonDisabled = false;
  ngOnInit() {
    this.user = this.app.allUsers[sessionStorage.getItem('userId')];

    this.mongo = this.user.mongoClient('Cluster0');
    this.Analyses = this.mongo.db('Data').collection('Analyses');

    if (this.analysisId == undefined) {
      this.route.queryParams.subscribe((params) => {
        //console.log(params); // { orderby: "price" }
        this.analysisId = params.id;
      });
    }
    if (this.userId == undefined) {
      this.userId = sessionStorage.getItem('userId');
      this.ButtonDisabled = false;
    }
    else {
      this.ButtonDisabled = true;
    }
    this.Analyses.findOne({ _id: ObjectID(this.analysisId) }).then((value) => {
      this.FormFields = value.fields;
      this.answers = value.answered.find((answer) => answer.id == this.userId);
      // console.log(this.answers);
    });
  }
}
