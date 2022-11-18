import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
})
export class InputTextComponent implements OnInit {
  @Input() field: any;
  @Input() prefilledValue: any = null;
  @Input() ButtonDisabled: boolean = false;

  valeur = '';
  @Output() newAnswerEvent = new EventEmitter<
    string | number | boolean | Array<any>
  >();
  addNewAnswer(value: string | number | boolean | Array<any>) {
    this.newAnswerEvent.emit(value);
  }

  constructor() {}
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
inputValue = ''
  ngOnInit() {
    this.delay(500).then((callback) => {
      if (this.prefilledValue != undefined) {
        this.inputValue = this.prefilledValue;
      }

      this.addNewAnswer('');
    });
  }
}
