import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { environment } from '../../../environments/environment';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Fruit {
  name: string;
}

export interface User {
  username: string;
  id: string;
}

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
  selector: 'app-create-analysis-page',
  templateUrl: './create-analysis-page.component.html',
  styleUrls: ['./create-analysis-page.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class CreateAnalysisPageComponent implements OnInit {
  name2 = 'Angular';
  commited: boolean;
  createForm = new FormGroup({
    analysis_name: new FormControl('', Validators.required),
    valid_on: new FormControl('', Validators.required),
    analysis_type: new FormControl('', Validators.required),

    quantities: new FormControl(''),
  });

  choices = new FormControl('', Validators.required);
  toppings = new FormControl('');
  productForm: FormGroup;
  isEditable = true;
  app = environment.application;
  user: any;
  mongo: any;
  collection: any;
  models: any[];
  Selected: string;
  nom_analyse: any;
  userList: Array<any>;
  userValues = [];
  Question_Type: Array<Array<any>> = [[]];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruitzs: Array<string> = [];
  formFruits = [this.fruitzs];
  toppingValues = [];
  toppingList = [this.fruitzs];
  addOnBlur = true;
  modelTable: any;

  // sortData(sort: Sort) {

  //   const data = this.model.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedData = data;
  //     return;
  //   }

  //   // this.sortedData = data.sort((a, b) => {
  //   //   const isAsc = sort.direction === 'asc';
  //   //   switch (sort.active) {
  //   //     case 'username':
  //   //       return compare(a.username, b.username, isAsc);
  //   //     case 'email':
  //   //       return compare(a.user_mail, b.user_mail, isAsc);
  //   //     // case 'roles':
  //   //     //   return compare(a.roles, b.roles, isAsc);

  //   //     // case 'carbs':
  //   //     //   return compare(a.carbs, b.carbs, isAsc);
  //   //     // case 'protein':
  //   //     //   return compare(a.protein, b.protein, isAsc);
  //   //     default:
  //   //       return 0;
  //   //   }
  //   // });
  // }

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.user = this.app.allUsers[sessionStorage.getItem('userId')];

    this.mongo = this.user.mongoClient('Cluster0');
    this.collection = this.mongo.db('Data').collection('models');

    this.productForm = this.fb.group({
      name: this.nom_analyse,
      quantities: this.fb.array(['1']),
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  question_types = [
    // {
    //   name : "text",
    //   displayName : "Texte",
    // },
    // {
    //   name : "checkbox",
    //   displayName : "Case à cocher"
    // },
    {
      name: 'radio button',
      displayName: 'Bouton Radio',
    },
    {
      name: 'slider',
      displayName: 'Echelle linéaire',
    },
    {
      name: 'input_text',
      displayName: 'Champ texte',
    },
    {
      name: 'training',
      displayName: 'Champ entraînement',
    },
  ];

  listOfNames = [];
  listOfIds = [];
  listOfTastes = [];

  tastesTypes = [
    {
      name: 'sweet',
      displayName: 'Sucré',
    },
    {
      name: 'bitter',
      displayName: 'Amer',
    },
    {
      name: 'salty',
      displayName: 'Salé',
    },
    {
      name: 'sour',
      displayName: 'Acide',
    },
    {
      name: 'umami',
      displayName: 'Umami',
    },
  ];

  ngOnInit() {
    this.collection.find({}).then((value) => {
      this.models = [...value];
      this.models.push({ name: 'Personnalisé' });
      this.modelTable = [...value];
    });

    this.mongo
      .db('Data')
      .collection('users')
      .find({})
      .then((arr) => {
        let usernameList = [];
        let userIdList = [];
        arr.forEach(function (us) {
          usernameList.push(us.username);
          userIdList.push(us.id);
        });
        this.listOfIds = userIdList;
        this.allUsers = usernameList;
        //console.log(this.allUsers.indexOf("feyelrd"))
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((user: string | null) =>
            user ? this._filterUser(user) : this.allUsers.slice()
          )
        );
        this.filteredRoles = this.userCtrl.valueChanges.pipe(
          startWith(null),
          map((Role: string | null) =>
            Role ? this._filterRole(Role) : this.allRoles.slice()
          )
        );
      });
  }
  allUsers: string[];
  allRoles: string[] = ['Admin', 'Jury', 'Observateur', 'Invité'];

  quantities(): FormArray {
    return this.productForm.get('quantities') as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      qty: '',
      price: '',
    });
  }

  FormFields: sensoryForm = {
    type: '',
    active: true,
    fields: [
      {
        label: '',
        format: {},
        required: false,
      },
    ],
    name: '',
    valid_on: '',
    invited: {
      users: [],
      roles: ['Jury'],
    },
    registered: [],
    answered: [],
  };

  add(event: MatChipInputEvent, index): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      // console.log(value)
      // console.log(index)
      this.formFruits[index].push(value);
      this.FormFields['fields'][index]['format']['choices'] =
        this.formFruits[index];
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: string, indexx): void {
    //const index = this.formFruits[indexx].indexOf(fruit);

    this.FormFields['fields'][indexx]['format']['choices'] =
      this.formFruits[indexx];
    this.formFruits[indexx].splice(indexx, 1);
  }

  editFormFruits(min, max, index) {
    let l = [];
    for (let i = min; i <= max; i++) {
      l.push(i);
    }
    this.formFruits[index] = l;
    this.toppingList[index] = l;
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
    //this.Question_Type.push([])
    // const new_fruit = this.formFruits.push([])
    //console.log(this.formFruits)
    //console.log(new_fruit)
    this.formFruits.push([]);
    //console.log(this.formFruits)
    this.toppingList.push(this.formFruits[this.formFruits.length - 1]);
    this.FormFields.fields.push({
      label: '',
      format: {},
      required: false,
    });
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);

    this.Question_Type.splice(i, 1);
    this.FormFields.fields.splice(i, 1);
    this.formFruits.splice(i, 1);
    this.toppingList.splice(i, 1);
    //this.Question_Type.removeAt(i);
  }

  finished = false;
  answerList = {};
  addAnswer(newAnswer: string | number | boolean | Array<any>, fieldNumber) {
    //this.answerList.push(newAnswer);
    this.answerList[fieldNumber] = newAnswer;
    //console.log(this.answerList)
  }
  onSubmitDo() {
    this.isEditable = false;
    this.FormFields['invited']['users'] = [];
    //console.log(this.listOfIds)
    let IDS = this.listOfIds;
    let USERS = this.allUsers;
    let displayedFormField = this.FormFields;
    this.commited = true;
    console.log(this.users);
    this.users.forEach(function (username) {
      let id = IDS[USERS.indexOf(username)];
      //console.log(displayedFormField)
      displayedFormField['invited']['users'].push({
        id: id,
        username: username,
      });
    });
    environment.application.allUsers[sessionStorage.getItem('userId')]
      .mongoClient('Cluster0')
      .db('Data')
      .collection('Analyses')
      .insertOne(displayedFormField)
      .then((result) => {
        this.openSnackBar('Le formulaire a bien été enregistré !', '');
      });
    //console.log(displayedFormField)
    // console.log(this.listOfIds[this.allUsers.indexOf(this.users[0])])
    // console.log(this.FormFields)
  }

  /////////////////////////////////
  userCtrl = new FormControl('');
  filteredUsers: Observable<any>;
  users: any = [];

  // allFruits: string[]  = this.userList // ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  addInviteUser(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.users.push(value);
      this.FormFields['invited']['users'] = this.users;
    }
    //console.log(this.FormFields)
    //console.log(this.FormFields['invited']['users']);
    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }
  value_Index = 0;

  Explain(event) {
    this.value_Index = event.selectedIndex;
    // console.log(this.FormFields);
    // return event.selectedIndex
  }
  removeInviteUser(fruit: string): void {
    const index = this.users.indexOf(fruit);

    if (index >= 0) {
      this.users.splice(index, 1);
      this.FormFields['invited']['users'] = this.users;
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.FormFields['invited']['users'] = this.users;
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filterUser(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  /////////////////////////////////
  roleCtrl = new FormControl('');
  filteredRoles: Observable<string[]>;
  roles: string[] = ['Jury'];

  // allFruits: string[]  = this.roleList // ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

  addInviteRole(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.roles.push(value);
      this.FormFields['invited']['roles'] = this.roles;
    }

    // Clear the input value
    event.chipInput!.clear();

    this.roleCtrl.setValue(null);
  }

  removeInviteRole(fruit: string): void {
    const index = this.roles.indexOf(fruit);

    if (index >= 0) {
      this.roles.splice(index, 1);
      this.FormFields['invited']['roles'] = this.roles;
    }
  }

  selectedRole(event: MatAutocompleteSelectedEvent): void {
    this.roles.push(event.option.viewValue);
    this.FormFields['invited']['roles'] = this.roles;
    this.roleInput.nativeElement.value = '';
    this.roleCtrl.setValue(null);
  }

  private _filterRole(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
}
function compare(
  a: number | string | boolean,
  b: number | string | boolean,
  isAsc: boolean
) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
