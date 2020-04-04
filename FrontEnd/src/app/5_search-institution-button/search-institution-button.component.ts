import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../7_services/validation/validation.service';
import { Feedback } from '../7_services/feedback/feedback.model';
import { FeedbackService } from '../7_services/feedback/feedback.service';

const IP_ADDRESS = "http://localhost:3000";

@Component({
  selector: 'app-search-institution-button',
  templateUrl: './search-institution-button.component.html',
  styleUrls: ['./search-institution-button.component.scss'],
})

export class SearchInstitutionButtonComponent implements OnInit {
  institutionAddress : string
  feedbacks : Feedback[] = []
  // myControl = new FormControl('value', this.validateAddress(address));

  constructor(private validationService: ValidationService, private feedbackService: FeedbackService) {}

  ngOnInit() {}

  validateInput(address) {
    this.institutionAddress = address
    var bool = this.validationService.validateAddress(address);
    var message = bool ? "Validated" : "Invalidated"
    console.log(message);
  }

  handleClick() {
    this.retrieveAllFeedback(this.institutionAddress);
  }
  
  async retrieveAllFeedback(address : string) {
    this.feedbacks = await this.feedbackService.retrieveAllFeedback(address);
  }

}
