import { Component } from '@angular/core';
import { AuthenticationService } from '../../7_services/authentication/authentication.service';
import { IdentificationService } from '../../7_services/identification/identification.service';

@Component({
  selector: 'app-institution',
  templateUrl: 'institution.page.html',
  styleUrls: ['institution.page.scss']
})
export class InstitutionPage {
  address : string
  isCA : boolean = false
  constructor(
    private authenticationService : AuthenticationService,
    private identificationService : IdentificationService
  ) {}

  async ngOnInit() {
    this.address = this.authenticationService.getUserAddress();
    var res = await this.identificationService.fetchAuthority(this.address);
    // is a CA, will add button that allows navigation to register institutions
    if (res) {
      var element = <HTMLInputElement> document.getElementById("register-institution-button");
      element.disabled = false;
    }
  }
}
