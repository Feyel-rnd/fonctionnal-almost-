import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-profile-view',
  templateUrl: './users-profile-view.component.html',
  styleUrls: ['./users-profile-view.component.css']
})
export class UsersProfileViewComponent implements OnInit {

  constructor(public route : ActivatedRoute) { }

id : string;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      //console.log(params); // { orderby: "price" }
      this.id = params.id;
      //console.log(this.id); // price
    });
  }

}