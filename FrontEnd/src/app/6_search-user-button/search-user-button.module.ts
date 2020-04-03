import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchUserButtonComponent } from './search-user-button.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [SearchUserButtonComponent],
  exports: [SearchUserButtonComponent]
})
export class SearchUserButtonComponentModule {}
