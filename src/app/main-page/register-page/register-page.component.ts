import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCalendarCellClassFunction, MatCalendarCellCssClasses, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

var TEST

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
  value : any;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {

//   dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
//     // Only highligh dates inside the month view.
//     if (view === 'month') {
//       const date = cellDate.getDate();
// console.log(this.analysis)
//       // Highlight the 1st and 20th day of each month.
//       return date === 1 || date === 20 ? 'example-custom-date-class' : '';
//     }

//     return '';
//   };


  

  constructor(public dialog: MatDialog) {
    
  }

  openDialog() {
    this.dialog.open(DialogData, {
      data: {
        animal: 'panda',
        value : TEST
      },
      
    });
  }

  valid_dates = []
  analysis : any;
  dateClass: MatCalendarCellClassFunction<Date> 

color2(results){
  console.log("3.1")
  this.dateClass = (cellDate, view) => {
    console.log('4')
       // Only highligh dates inside the month view.
       if (view === 'month') {
        console.log('5')
         const date = cellDate.getDate();
         if (date ===1){
          console.log('6')
           let newvar
         
           newvar = results
           console.log(results)
           
              
              return 'example-custom-date-class' ;
              console.log(newvar)
              
 }
         // Highlight the 1st and 20th day of each month.
         
       }
   
       
     };
}

  async color(){
    console.log('1')
    const app = environment.application;

  const user = app.allUsers[sessionStorage.getItem('userId')];
 
  const mongo = user.mongoClient('Cluster0');
  const Data = mongo.db('Data');
  const Analyses = Data.collection('Analyses');
  console.log('2')
    Analyses.find({}).then((results)=> {
      console.log('3')
      this.color2(results)
       })
  }

  ngOnInit() {
    
  const app = environment.application;

  const user = app.allUsers[sessionStorage.getItem('userId')];
 
  const mongo = user.mongoClient('Cluster0');
  const Data = mongo.db('Data');
  const Analyses = Data.collection('Analyses');
  
 
 

  //  this.valid_dates = vd

//  })
  }
selectedDate = ''

dateChanged(date) {
  TEST = date
  this.openDialog()
  console.log(`Selected: ${date}`);
}
}

@Component({
  selector: 'dialog-data',
  templateUrl: 'dialog-data.html',
})
export class DialogData {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}