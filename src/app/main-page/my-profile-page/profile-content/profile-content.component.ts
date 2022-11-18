import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import ObjectID from 'bson-objectid';

export interface User {
  _id: any;
  id: string;
  active: boolean;
  last_login: Date;
  username: string;
  created: Date;
  user_mail: string;
  roles: Array<string>;
  allergies: Array<string>;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
})
export class ProfileContentComponent implements OnInit {
  @Input() otherUserId: string;

  app = environment.application;
  // user : any;
  // mongo : any;
  // collection : any;
  user_mail: any;
  username: any;
  created: any;
  last_login: any;
  roles: Array<String>;
  toSuccess = false;
  allergens: string;
  fruits: string[] = [];
  condition: boolean;
  showSuccess() {
    this.toSuccess = true;
    const redirectUrl = '../success';
    let param = '';
    if (this.otherUserId == undefined) {
      param = sessionStorage.getItem('userId');
    } else {
      param = this.otherUserId;
    }
    this.router.navigate(['/dashboard/profile/success', param]);
  }
  user: any;
  mongo: any;
  collection: any;
  id: string;
  grade: string = '';
  current_xp = 0;
  next_xp = 1;
  ngOnInit() {
    // console.log(this.otherUserId);
    //  const user = this.app.allUsers[sessionStorage.getItem("userId")]

    // const mongo =user.mongoClient('Cluster0');
    // const collection = mongo.db('Data').collection("users");

    if (this.otherUserId != undefined) {
      this.id = this.otherUserId;
    } else {
      this.id = sessionStorage.getItem('userId');
    }

    this.user = this.app.allUsers[sessionStorage.getItem('userId')];
    this.mongo = this.user.mongoClient('Cluster0');
    this.collection = this.mongo.db('Data').collection('users');
    const grades = this.mongo.db('Data').collection('grades');

    this.collection.findOne({ _id: ObjectID(this.id) }).then((value) => {
      this.user_mail = value.user_mail;
      this.username = value.username;
      this.created = value.created.toLocaleString();
      this.last_login = value.last_login.toLocaleString();
      this.roles = value.roles;
      this.fruits = value.allergies;
      // this.current_xp = value.XP;
      Object.keys(value.sensory.tastes).forEach((taste) => {
        this.current_xp = this.current_xp + value.sensory.tastes[taste].success;
      });
      grades
        .aggregate([
          {
            $sort: {
              analyses_max: 1,
            },
          },
        ])
        .then((results) => {
          var detect = 0;
          results.forEach((result) => {
            if (this.current_xp < result.analyses_max && detect == 0) {
              detect = 1;

              this.grade = result.nom;
              this.next_xp = result.analyses_max;
            }
          });
        });
    });
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;

  allFruits: string[] = [
    'Sésame',
    'Céleri',
    'Poisson',
    'Mollusques',
    'Fruits à coque',
    'Gluten',
    'Sulfites',
    'Lupin',
    'Crustacés',
    'Lait',
    'Soja',
    'Moutarde',
    'Arachide',
    'Oeuf',
  ];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(public router: Router, private _snackBar: MatSnackBar) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
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

  writeUser(u_sername: string, allergens: Array<string>) {
    this.collection
      .updateOne(
        { _id: ObjectID(this.id) },
        { $set: { username: u_sername, allergies: allergens } }
      )
      .then((value) => {
        this.openSnackBar(
          'Les modifications ont été enregistrées !',
          'Recharger la page'
        )
          .afterDismissed()
          .subscribe(() => {
            window.location.reload();
          });
      });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
}
