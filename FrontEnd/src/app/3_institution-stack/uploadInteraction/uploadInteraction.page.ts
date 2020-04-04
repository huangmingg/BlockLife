import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from '../../7_services/interaction/interaction.service';
import { ValidationService } from '../../7_services/validation/validation.service';


@Component({
  selector: 'app-uploadInteraction',
  templateUrl: 'uploadInteraction.page.html',
  styleUrls: ['uploadInteraction.page.scss']
})


export class UploadInteractionPage {
  image: string
  recepientAddress: string
  // search page should contain search organization component
  constructor(private route: Router, private interactionService: InteractionService, private validationService: ValidationService) { }

  ngOnInit() {

}

  async validateAddress(address) {
    // currently does not check if the user has had an interaction with the institution before.
    // would this be a contract-based check?
    this.recepientAddress = address
    var bool = this.validationService.validateAddress(address);
    var message = bool ? "Validated" : "Invalidated"
    console.log(message);
  }

  async validateImage(image) {
    this.image = image;
  }

  async uploadInteraction() {
    var institutionAddress = "0xEa27b334967Fa7864748c39918EA6234Cd420747" // registered individual
    this.interactionService.addInteraction(this.image, this.recepientAddress, institutionAddress);
  }
  

}
