import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from '../../7_services/feedback/feedback.service';
import { ValidationService } from '../../7_services/validation/validation.service';

@Component({
  selector: 'app-submitFeedback',
  templateUrl: 'submitFeedback.page.html',
  styleUrls: ['submitFeedback.page.scss']
})


export class SubmitFeedbackPage implements OnInit {
  feedback: string
  institutionAddress: string
  // search page should contain search organization component
  constructor(private route: Router, private feedbackService: FeedbackService, private validationService: ValidationService) { }

  ngOnInit() {

}

  async validateAddress(address) {
    // currently does not check if the user has had an interaction with the institution before.
    // would this be a contract-based check?
    this.institutionAddress = address
    var bool = this.validationService.validateAddress(address);
    var message = bool ? "Validated" : "Invalidated"
    console.log(message);
  }

  async validateFeedback(feedback) {
    this.feedback = feedback;
  }

  async uploadFeedback() {
    var userAddress = "0xB422d54Cc2b92A2462f035E31d34e11e61ff54a1" // registered individual
    this.feedbackService.addFeedback(this.feedback, userAddress, this.institutionAddress);
  }
  
}
