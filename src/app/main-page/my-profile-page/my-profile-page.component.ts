import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {map, startWith} from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface User {
  _id: any;
  id: string;
  active: boolean;
  last_login: Date;
  username: string;
  created: Date;
  user_mail : string;
  roles : Array<string>;
  allergies:Array<string>;
  avatarUrl : string;
}

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css']
})
export class MyProfilePageComponent implements OnInit {
  
app = environment.application
// user : any;
// mongo : any;
// collection : any;
user_mail : any;
username : any;
created : any;
last_login : any;
roles : Array<String>
toSuccess = false;
allergens : string;
fruits: string[] = [];
condition :boolean;
showSuccess() {
  this.toSuccess = true;
  const redirectUrl = "../success"
  this.router.navigate(['/dashboard/profile/success']);

}
user = this.app.allUsers[sessionStorage.getItem("userId")]
    
   mongo =this.user.mongoClient('Cluster0');
  collection = this.mongo.db('Data').collection("users");
  ngOnInit() {
  //  const user = this.app.allUsers[sessionStorage.getItem("userId")]
    
  // const mongo =user.mongoClient('Cluster0');
  // const collection = mongo.db('Data').collection("users");
  


  this.collection.find({'id':this.user.id}).then((value:Array<User>)=>{ 
    this.user_mail = value[0].user_mail
    this.username = value[0].username
    this.created = value[0].created.toLocaleString()
    this.last_login = value[0].last_login.toLocaleString()
    this.roles = value[0].roles
    this.fruits = value[0].allergies
     
  })


  }
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  
  allFruits: string[] = ['Sésame','Céleri','Poisson','Mollusques','Fruits à coque','Gluten','Sulfites','Lupin','Crustacés','Lait','Soja','Moutarde','Arachide','Oeuf'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(public router: Router,private _snackBar: MatSnackBar) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }
  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action);
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
      
    }
    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
    
  }

  writeUser(u_sername:string,allergens:Array<string>) {
    this.collection.updateOne({'id':this.user.id},{$set:{'username':u_sername,'allergies':allergens}}).then((value)=> {
      
      this.openSnackBar("Les modifications ont été enregistrées !","Recharger la page").afterDismissed().subscribe(() => {
        window.location.reload()
      });
    })
  }

  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

}