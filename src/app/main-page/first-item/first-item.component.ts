import { Component, OnInit } from '@angular/core';
import * as Realm from 'realm-web';

@Component({
  selector: 'app-first-item',
  templateUrl: './first-item.component.html',
  styleUrls: ['./first-item.component.css']
})
export class FirstItemComponent implements OnInit {
  
  //console.log("Dog", Dog);
  constructor() { }

  ngOnInit() {

  const app = new Realm.App('data-icqqg');
  const mongo = app.currentUser.mongoClient('Cluster0');
  const collection = mongo.db('Users').collection("Example ID");
  collection.find({state:true}).then((value)=>{
    //console.log(value)
  })
  

  }

}