import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Realm from 'realm-web';
import { ConnexionFormComponent } from '../connexion-form/connexion-form.component';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadgeDataService } from './badge-data.service';
import ObjectID from 'bson-objectid';
import { DatabaseService } from './database.service';

// [{
//   $lookup: {
//    from: 'Analyses',
//    'let': {
//     id: '$id'
//    },
//    pipeline: [
//     {
//      $match: {
//       'fields.format.name': 'training',
//       $expr: {
//        $in: [
//         '$$id',
//         '$answered.id'
//        ]
//       }
//      }
//     }
//    ],
//    as: 'answeredAnalysis'
//   }
//  }, {
//   $set: {
//    Ecarts: {
//     'goût input': '$answeredAnalysis.fields.format.sensory_taste',
//     'goût noté': '$answeredAnalysis.answered.fields.sensory_taste',
//     'intensité input': '$answeredAnalysis.fields.format.sensory_intensity',
//     'intensité notée': '$answeredAnalysis.answered.fields.sensory_intensity'
//    }
//   }
//  }]

//const app = ConnexionFormComponent
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [BadgeDataService, DatabaseService],
})
export class MainPageComponent implements OnInit, OnDestroy {
  ngOnDestroy() {
    //window.alert('hello');
    this.subscription.unsubscribe();
  }
  logRoute() {
    this.backend.usersFromUser.findOne({}).then((result) => {
      console.log(result);
    });
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public data: BadgeDataService,
    public backend: DatabaseService
  ) {}
  selectedInSidenav(path: string) {
    // console.log(this.router.url);
    return this.router.url === '/dashboard/'.concat(path);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  subscription: Subscription;
  showFiller = false;
  userRefreshToken: string;
  // bla : any;
  username: string;
  userid: string;
  result: any;
  // app : any
  isOut = false;
  authorized: boolean;
  jury: boolean;
  connected_users: number;
  app = environment.application;
  my_analysis_badge: string;
  async LogOut() {
    const mongo = environment.application.currentUser.mongoClient('Cluster0');
    const Data = mongo.db('Data');
    const users = Data.collection('users');
    users.updateOne(
      { '_id ': ObjectID(sessionStorage.getItem('userId')) },
      { $set: { isLoggedIn: false } }
    );
    await this.app.allUsers[sessionStorage.getItem('userId')].logOut();
    sessionStorage.clear();

    const redirectUrl = '/login';

    // Redirect the user
    this.router.navigate([redirectUrl]);
  }
  analyses_actives = '';

  modifyBadge(value: string) {
    this.data.changeAnswerBadge(value);
  }

  registerOrUnregister(choice: boolean) {
    this.data.registerOrUnregister(choice);
  }
  modifyAnalysisBadge(value: string) {
    this.data.changeMyAnalysisBadge(value);
  }

  supOneAnalysis() {
    this.data.analysisDone();
  }
  isAnswering: boolean;
  ngOnInit() {
    this.isAnswering = false;
    function canAnswer(analyse) {
      let today = new Date();

      if (
        analyse.valid_on.getDate() == today.getDate() &&
        analyse.valid_on.getMonth() == today.getMonth() &&
        analyse.valid_on.getFullYear() == today.getFullYear()
      ) {
        return true;
      }
    }
    let user: any;
    try {
      user = environment.application.allUsers[sessionStorage.getItem('userId')];
    } catch (err) {
      console.error('Echec', err);
    }
    //const user = JSON.parse(sessionStorage.getItem("user"))

    //this.userRefreshToken = sessionStorage.getItem("userRefreshToken");
    //console.log(this.app.currentUser)
    this.jury = sessionStorage.getItem('role') == 'Jury';
    this.authorized =
      sessionStorage.getItem('userId') == '63429fec8679d1a724204416';

    const mongo = environment.application.currentUser.mongoClient('Cluster0');
    const Data = mongo.db('Data');
    const Analyses = Data.collection('Analyses');
    const users = Data.collection('users');
    //console.log(this.app.allUsers)
    users.findOne({ id: user.id }).then((value) => {
      // console.log(value);
      this.username = value.username;
    });

    //console.log(this.app.allUsers[key].isLoggedIn)

    //console.log(this.connected_users)
    users.findOne({ id: user.id }).then((current_user) => {
      // console.log(current_user) OK
      let today = new Date();
      today.setHours(-3, 0, 0);
      let query2: any;
      if (this.jury) {
        query2 = {
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
        query2 = {
          $and: [
            { active: true },
            { valid_on: { $gte: today } },
            {
              $or: [
                { 'invited.users': { $elemMatch: { id: current_user.id } } },
                { 'invited.roles': { $in: current_user.roles } },
              ],
            },
          ],
        };
      }
      Analyses.find(query2).then((value) => {
        // console.log(current_user.roles);
        // console.log(value.invited.roles);

        //
        //
        let num = 0;
        //console.log(value)
        value.forEach(function (resu) {
          let today = new Date();

          if (
            resu.valid_on.getDate() == today.getDate() &&
            resu.valid_on.getMonth() == today.getMonth() &&
            resu.valid_on.getFullYear() == today.getFullYear()
          ) {
            num = num + 1;
            //console.log(num)
          }
          // if (this.canAnswer(resu)) {
          //   num = num +1
          // }
        });
        //console.log(num)
        //this.analyses_actives = num.toString()
        //console.log(this.analyses_actives)
        this.subscription = this.data.currentAnswerBadge.subscribe(
          (val) => (this.analyses_actives = val)
        );
        this.data.changeAnswerBadge(num.toString());
        //
      });

      //console.log(this.authorized)
      var query: any = {
        $and: [
          { active: true },
          {
            $or: [
              { 'invited.users': { $elemMatch: { id: current_user.id } } },
              { 'invited.roles': { $in: current_user.roles } },
            ],
          },
        ],
      };
      if (this.authorized) {
        query = {
          $or: [
            { 'invited.users': { $elemMatch: { id: current_user.id } } },
            { 'invited.roles': { $in: current_user.roles } },
          ],
        };
      }
      Analyses.find(query).then((value) => {
        let n = 0;
        value.forEach((analyse) => {
          if (
            this.canRegister(analyse) &&
            !this.hasRegistered(analyse, current_user)
          ) {
            n = n + 1;
          }
        });
        //console.log(n)
        this.modifyAnalysisBadge(n.toString());
        //console.log(this.analysis)
      });
    });
    this.subscription = this.data.currentMyAnalysisBadge.subscribe(
      (val) => (this.my_analysis_badge = val)
    );
    // collection2.find({}).then((value)=>{
    //   this.result = value[0]["owner_id"]
    // })
    //sessionStorage.getItem("userRefreshToken");
    //sessionStorage.getItem("email");
    //sessionStorage.getItem("username");
  }
  hasRegistered(analyse, user) {
    return analyse.registered.indexOf(user.id) > -1;
  }
  canRegister(analyse) {
    let today = new Date();
    if (analyse.valid_on < today) {
      return false;
    }
    return true;
    //yourDate.setDate(yourDate.getDate() + 1);
  }
}
