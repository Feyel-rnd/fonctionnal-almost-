import {
  Component,
  HostListener,
  Inject,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import ObjectID from 'bson-objectid';
import { Subject } from 'rxjs';

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

// @Injectable()
// export class MyCustomPaginatorIntl implements MatPaginatorIntl {
//   changes = new Subject<void>();

//   // For internationalization, the `$localize` function from
//   // the `@angular/localize` package can be used.
//   firstPageLabel = 'Première page';
//   itemsPerPageLabel = 'Utilisateurs par page';
//   lastPageLabel = 'Dernière page';

//   // You can set labels to an arbitrary string too, or dynamically compute
//   // it through other third-party internationalization libraries.
//   nextPageLabel = 'Page suivante';
//   previousPageLabel = 'Page précédente';

//   getRangeLabel(page: number, pageSize: number, length: number): string {
//     if (length === 0) {
//       return `Page 1 sur 1 /// ${length} utilisateurs `;
//     }
//     const amountPages = Math.ceil(length / pageSize);
//     return `Page ${page + 1} sur ${amountPages} /// ${length} utilisateurs`;
//   }
// }

@Component({
  selector: 'app-connected-users-table',
  templateUrl: './connected-users-table.component.html',
  styleUrls: ['./connected-users-table.component.css'],
  // providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ConnectedUsersTableComponent implements OnInit {
  app = environment.application;
  Activeuser: any;
  mongo: any;
  collection: any;
  myID = sessionStorage.getItem('userId');
  user: User[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortedData: User[];

  displayedColumns: any = ['name', 'email', 'last_login', 'roles', 'actions'];

  // @HostListener('window:resize', []) updateDays() {
  //   // lg (for laptops and desktops - screens equal to or greater than 1200px wide)
  //   // md (for small laptops - screens equal to or greater than 992px wide)
  //   // sm (for tablets - screens equal to or greater than 768px wide)
  //   // xs (for phones - screens less than 768px wide)

  //   if (window.innerWidth >= 800) {
  //     this.displayedColumns = [
  //       'name',
  //       'email',
  //       'last_login',
  //       'roles',
  //       'actions',
  //     ]; // lg
  //   } else {
  //     this.displayedColumns = ['name', 'roles', 'actions'];
  //   }
  // }

  openDialog(userID): void {
    //console.log(analyseID)
    const dialogRef = this.dialog.open(DialogDeleteUser, {
      width: '360px',
      data: { _id: userID },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      //console.log(result)
      if (result) {
        // console.log(userID);
        this.refreshDatasource(this.dataSource, userID);
        // this.length = this.sortedData.length;
      }
    });
  }
  refreshDatasource(dataSource, user) {
    let myData = dataSource.data;
    myData.splice(myData.indexOf(user), 1);
    dataSource.data = myData;
    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  removeUser(id) {
    this.openDialog(id);
  }
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.Activeuser = this.app.allUsers[sessionStorage.getItem('userId')];
    // console.log(this.app[this.Activeuser].isLoggedIn())

    this.mongo = this.Activeuser.mongoClient('Cluster0');
    this.collection = this.mongo.db('Data').collection('users');

    this.collection.find({}).then((value) => {
      //console.log(value)
      // this.user = value;
      this.dataSource = new MatTableDataSource(value);
      this.delay(10).then((callback) => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      // //console.log(this.user)
      // this.sortedData = this.user.slice();
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

@Component({
  selector: 'dialog-delete-user',
  templateUrl: 'dialog-delete-user.html',
})
export class DialogDeleteUser implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogDeleteUser>,
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

  onNoClick(val: boolean, id: any): void {
    //console.log(this.data._id)
    if (val) {
      this.users.deleteOne({ _id: ObjectID(id) }).then((value) => {
        this.openSnackBar('Utilisateur supprimé !', '');
        this.dialogRef.close(true);
      });
    }
    //console.log(val)
    else {
      this.openSnackBar('Opération annulée.', '');
      this.dialogRef.close(false);
    }
  }
}
