import { Router } from '@angular/router';
import * as Realm from 'realm-web';

const app = new Realm.App('data-icqqg');
//const mongo = environment.application.currentUser.mongoClient('Cluster0')
//const Data = mongo.db('Data')
// const user = environment.application.allUsers[sessionStorage.getItem('userId')]
// const Analyses = Data.collection('Analyses')
// const users = Data.collection('users')

export interface env {
  application: any;
  // mongo : any,
  // Data : any,
  // Analyses : any,
  // users :any,
}

export const environment: env = {
  application: app,
  // user : app.allUsers[sessionStorage.getItem('userId')],
  // mongo : app.allUsers[sessionStorage.getItem('userId')],//.mongoClient('Cluster0'),
  // Data : '',
  // Analyses : '',
  // users :'',
  // Data : mongo.db('Data'),
  // Analyses : Data.collection('Analyses'),
  // users : Data.collection('users'),
};

export class Componentt {}
