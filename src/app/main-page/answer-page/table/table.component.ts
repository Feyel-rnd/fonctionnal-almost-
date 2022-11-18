import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BadgeDataService } from '../../badge-data.service';
import { MainPageComponent } from '../../main-page.component';

export interface Analysis {
  _id: any;
  type: string;
  active: boolean;
  fields: any;
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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [BadgeDataService],
})
export class TableComponent implements OnInit, OnDestroy {
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  answering = false;
  app = environment.application;
  // user: any;
  subscription: Subscription;
  collection: any;
  current_id: string;
  analysis: Analysis[];
  title: string;
  currentItem = 'Television';
  current_analysis: any;
  sortedData: Analysis[];
  _router: any;
  mongo = environment.application.currentUser.mongoClient('Cluster0');
  Data = this.mongo.db('Data');
  user = environment.application.allUsers[sessionStorage.getItem('userId')];
  Analyses = this.Data.collection('Analyses');
  users = this.Data.collection('users');
  badge: string;
  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    public data: BadgeDataService,
    private main: MainPageComponent
  ) {
    //console.log(this.app.allUsers)
    // users.find({ id: this.user.id }).then((value) => {
    //   this.username = value[0].username;
    //   this.email = value.user_mail;
    // });
    //console.log(this.app.allUsers[key].isLoggedIn)
    //console.log(this.connected_users)
  }

  canAnswer(analyse) {
    let today = new Date();

    if (
      analyse.valid_on.getDate() == today.getDate() &&
      analyse.valid_on.getMonth() == today.getMonth() &&
      analyse.valid_on.getFullYear() == today.getFullYear()
    ) {
      return true;
    }

    return false;
    //yourDate.setDate(yourDate.getDate() + 1);
  }

  navigateToFoo(id) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate(['form'], {
      relativeTo: this._route,
      queryParams: {
        id: id,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false,
      // do not trigger navigation
    });
  }

  AnalysisAnswer(id) {
    this.current_id = id;
    //console.log(id)
    this.collection.find({ _id: id }).then((value) => {
      //console.log(value)
      this.current_analysis = value[0].fields;
      this.title = value[0].name;
    });
    //this.answering=!this.answering
  }
  sortData(sort: Sort) {
    const data = this.analysis.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'active':
          return compare(a.active, b.active, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        // case 'carbs':
        //   return compare(a.carbs, b.carbs, isAsc);
        // case 'protein':
        //   return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
  }

  addOne() {
    this.main.supOneAnalysis();
    //this.data.changeAnswerBadge("z")
  }

  hasAnswered(analysis, userID) {
    if (analysis.answered.indexOf(userID) > -1) {
      return true;
    }
    return false;
  }
  jury = sessionStorage.getItem('role') == 'Jury';
  ngOnInit() {
    this.subscription = this.data.currentAnswerBadge.subscribe(
      (val) => (this.badge = val)
    );

    let today = new Date();
    let today2 = new Date();
    today.setHours(-3, 0, 0);
    let query: any;
    this.users.findOne({ id: this.user.id }).then((current_user) => {
      if (this.jury) {
        query = {
          $and: [
            { active: true },
            { valid_on: { $gte: today } },
            { answered: { $not: { $elemMatch: { id: current_user.id } } } },
            { registered: { $in: [current_user.id] } },
            {
              $or: [
                { 'invited.users': { $elemMatch: { id: current_user.id } } },
                { 'invited.roles': { $in: current_user.roles } },
              ],
            },
          ],
        };
      } else {
        query = {
          $and: [
            { active: true },
            { valid_on: { $gte: today } },
            {
              $or: [{ 'invited.users': { $elemMatch: { id: current_user.id } } },
              { 'invited.roles': { $in: current_user.roles } }],
            },
          ],
        };
      }

      this.Analyses.find(query).then((value) => {
        this.analysis = [...value];
        //this.badge = '20'
        // let n = 0;
        // value.forEach(function (analyse) {
        //   //console.log(analyse)
        //   if (
        //     analyse.valid_on.getDate() == today2.getDate() &&
        //     analyse.valid_on.getMonth() == today2.getMonth() &&
        //     analyse.valid_on.getFullYear() == today2.getFullYear()
        //   ) {
        //     //console.log(n)
        //     n = n + 1;
        //   }
        // });

        //this.main.modifyBadge(n.toString())
        this.sortedData = this.analysis.slice();
      });
    });
    try {
    } catch (err) {
      console.error('Echec', err);
    }
  }
}

function compare(
  a: number | string | boolean,
  b: number | string | boolean,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
