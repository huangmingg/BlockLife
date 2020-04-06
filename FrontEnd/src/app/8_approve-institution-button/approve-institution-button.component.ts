import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../7_services/register/register.service';

@Component({
    selector: 'app-approve-institution-button',
    templateUrl: './approve-institution-button.component.html',
    styleUrls: ['./approve-institution-button.component.scss'],
  })

export class ApproveInstitutionButtonComponent implements OnInit {

    newInstitutionAddress: string
    // search page should contain search organization component
    constructor(private route: Router, private registerService: RegisterService) { }
  
    ngOnInit() {
  
}



    async validateAddress(address) {
    // currently does not check if the user has had an interaction with the institution before.
    // would this be a contract-based check?
    this.newInstitutionAddress = address
    }

    async approveInstitution() {
        var userRegisteringAddress = "0xa0ce3bdd2615fe4959e6fdf30955d73924da2e7c"
        var successful = this.registerService.registerInstitution(this.newInstitutionAddress, userRegisteringAddress)
        console.log(successful)
        console.log("hello")
    }

}