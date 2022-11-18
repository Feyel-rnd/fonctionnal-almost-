import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-training-input',
  templateUrl: './training-input.component.html',
  styleUrls: ['./training-input.component.css'],
})
export class TrainingInputComponent implements OnInit {
  @Input() field: any;
  @Input() prefilledValue: any = {
    sensory_intensity: 0,
    sensory_taste: ' ',
  };
  @Input() ButtonDisabled: boolean = false;

  valeur = '';
  slidervalue = 1;
  @Output() newAnswerEvent = new EventEmitter<any>();
  assignTaste(choice) {
    this.valeur = choice;
  }
  // assignIntensity(slideval) {
  //   this.intensity = slidervalue
  // }
  addNewAnswer(value: any) {
    // console.log(value)
    // console.log(value);
    this.newAnswerEvent.emit(value);
  }

  constructor() {
    // console.log(this.field);
    // this.goodTaste = this.reTransform(this.field.format);
    // console.log(this.goodTaste);
  }
  champ_radio_entrainement = {
    format: {
      name: 'radio button',
      choices: ['Sucré', 'Salé', 'Umami', 'Acide', 'Amer', 'Aucun'],
    },
  };

  reTransform(value) {
    // console.log('value', value);
    let ind = ['sweet', 'salty', 'umami', 'sour', 'bitter', 'none'].indexOf(
      value.sensory_taste
    );
    let val = ['Sucré', 'Salé', 'Umami', 'Acide', 'Amer', 'Aucun'][ind];
    //console.log('val', val);
    return val;
  }

  transform(value) {
    // console.log(value);
    let d = ['sweet', 'salty', 'umami', 'sour', 'bitter', 'none'][
      ['Sucré', 'Salé', 'Umami', 'Acide', 'Amer', 'Aucun'].indexOf(value)
    ];
    // console.log(d);
    return d;
  }

  choices = ['Sucré', 'Salé', 'Umami', 'Acide', 'Amer', 'Aucun'];

  champ_slider_entrainement() {
    return {
      format: {
        name: 'slider',
        min: 1,
        max: 10,
      },
      // label : label
    };
  }
  goodTaste = '';
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  ngOnInit() {
    // console.log(this.field);
    this.delay(500).then((callback) => {
      // console.log(this.reTransform(this.prefilledValue));
      if (this.prefilledValue != null) {
        this.prefilledValue.sensory_taste = this.reTransform(
          this.prefilledValue
        );
        this.valeur = this.prefilledValue.sensory_taste;
        // console.log(this.valeur);
        this.slidervalue = this.prefilledValue.sensory_intensity;
      }

      this.addNewAnswer({ sensory_intensity: 1, sensory_taste: 'none' });
    });
  }
}
