import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondItemComponent } from './second-item.component';
import { MaterialExampleModule } from '../../../material/material.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,MaterialExampleModule,MatTableModule
  ],
  declarations: [SecondItemComponent],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SecondItemModule { }