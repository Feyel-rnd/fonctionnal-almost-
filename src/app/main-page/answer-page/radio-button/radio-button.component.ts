import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements OnInit {
  @Input() prefilledValue: any = null;
  @Input() ButtonDisabled: boolean = false;
  ////////////////
  onChange: any = () => {};
  onTouch: any = () => {};
  val = ''; // this is the updated value that the class accesses
  set value(val) {
    // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  // this method sets the value programmatically
  writeValue(value: any) {
    this.value = value;
  }
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  //////////////

  @Input() field: any;
  @Output() newAnswerEvent = new EventEmitter<
    string | number | boolean | Array<any>
  >();
  addNewAnswer(value: string | number | boolean | Array<any>) {
    this.newAnswerEvent.emit(value);
  }

  id: string;
  app = environment.application;
  constructor(
    private _Activatedroute: ActivatedRoute,
    private controlContainer: ControlContainer
  ) {}
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  radioValue = '';
  ngOnInit() {
    this.delay(500).then((callback) => {
      if (this.prefilledValue != null) {
        this.radioValue = this.prefilledValue;
      }
    });
    this._Activatedroute.paramMap.subscribe((params) => {
      this.id = params.get('id');
    });
    this.addNewAnswer(null);
  }
}
