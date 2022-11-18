import { Component, Inject, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  _id: any;
  id: string;
  active: boolean;
  last_login: Date;
  username: string;
  created: Date;
  user_mail: string;
  roles: Array<string>;
}

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.css'],
})
export class ConnectedUsersComponent implements OnInit {
  app = environment.application;
  Activeuser: any;
  mongo: any;
  collection: any;
  myID = sessionStorage.getItem('userId');
  user: User[];

  sortedData: User[];

  constructor(public router: Router, private route: ActivatedRoute) {
    this.Activeuser = this.app.allUsers[sessionStorage.getItem('userId')];
    // console.log(this.app[this.Activeuser].isLoggedIn())

    this.mongo = this.Activeuser.mongoClient('Cluster0');
    this.collection = this.mongo.db('Data').collection('users');

    this.collection.find({}).then((value) => {
      //console.log(value)
      this.user = value;

      //console.log(this.user)
      this.sortedData = this.user.slice();
    });
  }

  navigateToFoo(id) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate(['users-profile'], {
      relativeTo: this.route,
      queryParams: {
        id: id,
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false,
      // do not trigger navigation
    });
  }

  sortData(sort: Sort) {
    const data = this.user.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'username':
          return compare(a.username, b.username, isAsc);
        case 'email':
          return compare(a.user_mail, b.user_mail, isAsc);
        // case 'roles':
        //   return compare(a.roles, b.roles, isAsc);

        // case 'carbs':
        //   return compare(a.carbs, b.carbs, isAsc);
        // case 'protein':
        //   return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
  }

  refresh() {
    window.location.reload();
  }
  ngOnInit() {
    //console.log(this.app.allUsers[0])
    try {
    } catch (err) {
      console.error('Echec', err);
    }
  }

  ngOnDestroy() {
    //this.Activeuser.mongoClient('Cluster0').close()
  }
}
function compare(
  a: number | string | boolean,
  b: number | string | boolean,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
