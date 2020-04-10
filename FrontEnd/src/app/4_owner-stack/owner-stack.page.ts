import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../7_services/register/register.service';
import { AuthenticationService } from '../7_services/authentication/authentication.service';

@Component({
  selector: 'app-owner-stack',
  templateUrl: './owner-stack.page.html',
  styleUrls: ['./owner-stack.page.scss'],
})
export class OwnerStackPage implements OnInit {

  newCaAddress: string
  constructor (
      private route: Router, 
      private registerService: RegisterService,
      private authenticationService: AuthenticationService
      ) { }

  ngOnInit() {}
  
  async validateCaAddress(address) {
      this.newCaAddress = address
  }

  async approveInstitution() {
      var userAddress = this.authenticationService.getUserAddress();
      var successful = await this.registerService.registerCA(this.newCaAddress, userAddress)
      console.log(successful)
  }
}
