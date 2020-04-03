import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchInstitutionButtonComponent } from './search-institution-button.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [SearchInstitutionButtonComponent],
  exports: [SearchInstitutionButtonComponent]
})
export class SearchInstitutionButtonComponentModule {}
