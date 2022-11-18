import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  @Input() otherUserId: string;
  constructor(private router : Router, private route : ActivatedRoute) { }
id : string;
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      //console.log(params); // { orderby: "price" }
      this.id = params.id;
      //console.log(this.id); // price
    });
  }

}