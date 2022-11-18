import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  @Input() field: any;
  @Input() prefilledValue: any = null;
  @Input() ButtonDisabled: boolean = false;

  @Output() newAnswerEvent = new EventEmitter<
    string | number | boolean | Array<any>
  >();
  addNewAnswer(value: string | number | boolean | Array<any>) {
    this.newAnswerEvent.emit(value);
  }

  autoTicks = false;
  disabled = false;
  invert = false;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  tickInterval = 1;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }
  constructor() {}
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  sliderVal = 0;
  ngOnInit() {
    this.delay(500).then((callback) => {
      if (this.prefilledValue != null) {
        this.sliderVal = this.prefilledValue;
      }
    });
    this.addNewAnswer(0);
  }
}
