import {
  Component,
  Inject,
  Injectable,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import ObjectID from 'bson-objectid';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BadgeDataService } from '../../badge-data.service';
import { Subject, Subscriber, Subscription } from 'rxjs';
import { MainPageComponent } from '../../main-page.component';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

// @Injectable()
// export class MyCustomPaginatorIntl2 implements MatPaginatorIntl {
//   changes = new Subject<void>();

//   // For internationalization, the `$localize` function from
//   // the `@angular/localize` package can be used.
//   firstPageLabel = 'Première page';
//   itemsPerPageLabel = 'Analyses par page';
//   lastPageLabel = 'Dernière page';

//   // You can set labels to an arbitrary string too, or dynamically compute
//   // it through other third-party internationalization libraries.
//   nextPageLabel = 'Page suivante';
//   previousPageLabel = 'Page précédente';

//   getRangeLabel(page: number, pageSize: number, length: number): string {
//     if (length === 0) {
//       return `Page 1 sur 1 /// ${length} analyses `;
//     }
//     const amountPages = Math.ceil(length / pageSize);
//     return `Page ${page + 1} sur ${amountPages} /// ${length} analyses`;
//   }
// }

@Component({
  selector: 'app-analysis-table',
  templateUrl: './analysis-table.component.html',
  styleUrls: ['./analysis-table.component.css'],
  providers: [
    BadgeDataService,
    // { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl2 },
  ],
})
export class AnalysisTableComponent implements OnInit, OnDestroy {
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  openDialog(analyse): void {
    //console.log(analyseID)
    const dialogRef = this.dialog.open(DialogOnDelete, {
      width: '360px',
      data: { _id: analyse._id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
      //console.log(result)
      if (result) {
        this.refreshDatasource(this.dataSource, analyse);

        // this.length = this.sortedData.length;
      }
    });
  }
  userID = sessionStorage.getItem('userId');
  name2 = 'Angular';

  app = environment.application;
  user: any;
  mongo: any;
  Analyses: any;
  authorized = false;
  analysis: Analysis[];

  sortedData: Analysis[];

  // length = 50;
  // pageSize = 10;
  // pageIndex = 0;
  // pageSizeOptions = [5, 25, 50, 100];
  // showFirstLastButtons = true;
  // handlePageEvent(event: PageEvent) {
  //   this.length = event.length;
  //   console.log(this.length);
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  // }

  hasAnswered(analyse) {
    return analyse.answered.some((e) => e.id === this.userID);
  }

  hasRegistered(analyse) {
    return analyse.registered.indexOf(this.userID) > -1;
  }

  registered_list = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private data: BadgeDataService,
    private main: MainPageComponent
  ) {
    // this.length = this.sortedData.length;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  register(analyse, userID) {
    this.Analyses.updateOne(
      { _id: ObjectID(analyse._id) },
      { $push: { registered: userID } }
    );
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/dashboard/my-analysis']);
    // });
    this.openSnackBar(
      "Vous êtes inscrit pour l'analyse : " + analyse.name + ' !',
      ''
    );
    //   console.log(this.registered_list)
    //   console.log(this.registered_list[analyse.id].indexOf(userID))
    this.sortedData.find((e) => e._id == analyse._id).registered.push(userID);
    this.main.registerOrUnregister(true);
  }

  canRegister(analyse) {
    let today = new Date();
    if (analyse.valid_on < today) {
      return false;
    }
    return true;
    //yourDate.setDate(yourDate.getDate() + 1);
  }

  unregister(analyse, userID) {
    this.Analyses.updateOne(
      { _id: ObjectID(analyse._id) },
      { $pull: { registered: userID } }
    );
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/dashboard/my-analysis']);
    // });
    this.openSnackBar(
      "Vous êtes désinscrit pour l'analyse : " + analyse.name + ' !',
      ''
    );
    //   console.log(this.registered_list)
    //   console.log(this.registered_list[analyse.id].indexOf(userID))
    // this.sortedData.find(e => e._id==analyse._id).registered.pull

    const index = this.sortedData
      .find((e) => e._id == analyse._id)
      .registered.indexOf(userID, 0);
    if (index > -1) {
      this.sortedData
        .find((e) => e._id == analyse._id)
        .registered.splice(index, 1);
    }
    this.main.registerOrUnregister(false);
  }

  updateAnalysis(analyse, event) {
    //console.log(event.checked)
    this.Analyses.updateOne(
      { _id: ObjectID(analyse._id) },
      { $set: { active: event.checked } }
    );
    var affiche = 'inactive';
    if (event.checked) {
      affiche = 'active';
    }
    this.openSnackBar(
      "L'analyse '" + analyse.name + "' est devenue " + affiche + '.',
      ''
    );
  }
  navigateToFoo(id) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate(['view'], {
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

  adminNavigateToFoo(id) {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    this.router.navigate(['admin-view'], {
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
        case 'validity':
          return compare(b.valid_on, a.valid_on, isAsc);
        // case 'carbs':
        //   return compare(a.carbs, b.carbs, isAsc);
        // case 'protein':
        //   return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
  }
  vide: boolean;

  deleteAnalysis(id) {
    this.openDialog(id);
  }
  subscription: Subscription;
  badge = '';
  dataSource: MatTableDataSource<Analysis>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // displayedColumns = [
  //   'name',
  //   'type',
  //   'valid_on',
  //   'registered',
  //   'answered',
  //   'active',
  //   'actions',
  // ];

  displayedColumns = [];
  ngAfterViewInit() {}

  refreshDatasource(dataSource, analyse) {
    let myData = dataSource.data;
    myData.splice(myData.indexOf(analyse), 1);
    dataSource.data = myData;
    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  ngOnInit() {
    this.subscription = this.data.currentMyAnalysisBadge.subscribe(
      (val) => (this.badge = val)
    );

    this.user = this.app.allUsers[sessionStorage.getItem('userId')];

    this.mongo = this.user.mongoClient('Cluster0');
    const Data = this.mongo.db('Data');
    this.Analyses = Data.collection('Analyses');
    const users = Data.collection('users');
    const longueur = 0;
    users.findOne({ id: this.user.id }).then((current_user) => {
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
      this.Analyses.aggregate([
        {
          $match: query,
        },
        {
          $sort: {
            valid_on: -1,
          },
        },
      ]).then((value) => {
        if (value.length == 0) {
          this.vide = true;
        } else {
          this.vide = false;
          this.analysis = value;

          let n = 0;
          value.forEach((analyse) => {
            if (this.canRegister(analyse) && !this.hasRegistered(analyse)) {
              n = n + 1;
            }
          });
          //console.log(n)
          this.main.modifyAnalysisBadge(n.toString());
          //console.log(this.analysis)
          if (this.authorized) {
            this.displayedColumns = [
              'name',
              'type',
              'valid_on',
              'registered',
              'answered',
              'active',
              'actions',
            ];
          } else {
            this.displayedColumns = [
              'name',
              'type',
              'valid_on',
              'registered',
              'answered',
              'actions',
            ];
          }
          this.dataSource = new MatTableDataSource(value);
          this.sortedData = this.analysis.slice();
          this.delay(10).then((callback) => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

          // this.longueur = this.analysis.length
          //console.log(this.analysis.length);
        }
      });
    });
    try {
      this.vide = null;
      this.authorized =
        sessionStorage.getItem('userId') == '63429fec8679d1a724204416';
    } catch (err) {
      console.error('Echec', err);
    }
  }
}

@Component({
  selector: 'dialog-on-delete',
  templateUrl: 'dialog-on-delete.html',
})
export class DialogOnDelete implements OnInit {
  constructor(
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogOnDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  user: any;
  mongo: any;
  Analyses: any;
  app = environment.application;
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  ngOnInit() {
    this.user = this.app.allUsers[sessionStorage.getItem('userId')];

    // console.log(this.analysis.length);
    this.mongo = this.user.mongoClient('Cluster0');
    const Data = this.mongo.db('Data');
    this.Analyses = Data.collection('Analyses');
  }

  onNoClick(val: boolean, id: any): void {
    //console.log(this.data._id)
    if (val) {
      this.Analyses.deleteOne({ _id: ObjectID(id) }).then((value) => {
        this.openSnackBar('Analyse supprimée !', '');
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

function compare(
  a: number | string | boolean,
  b: number | string | boolean,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
