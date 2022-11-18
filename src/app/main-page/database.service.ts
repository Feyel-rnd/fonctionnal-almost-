import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class DatabaseService implements OnInit {
  app = environment.application;
  fromUser = this.app.currentUser.mongoClient('Cluster0');
  Data = this.fromUser.db('Data');
  AnalysesFromUser = this.Data.collection('Analyses');
  usersFromUser = this.Data.collection('users');
 
  
 
  ngOnInit() {}

  constructor() {
  
  }
}
