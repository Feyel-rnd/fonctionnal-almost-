import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sensory-profiles-page',
  templateUrl: './sensory-profiles-page.component.html',
  styleUrls: ['./sensory-profiles-page.component.css']
})
export class SensoryProfilesPageComponent implements OnInit {

  constructor(private _router : Router) { }

  ngOnInit() {
  }

}