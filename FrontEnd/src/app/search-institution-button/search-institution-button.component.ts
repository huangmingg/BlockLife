import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../validation.service';

const IP_ADDRESS = "http://localhost:3000";

@Component({
  selector: 'app-search-institution-button',
  templateUrl: './search-institution-button.component.html',
  styleUrls: ['./search-institution-button.component.scss'],
})

export class SearchInstitutionButtonComponent implements OnInit {
  institutionAddress : string
  feedbacks = []
  // myControl = new FormControl('value', this.validateAddress(address));

  constructor(private validationService: ValidationService) {}

  ngOnInit() {}

  validateInput(address) {
    this.institutionAddress = address
    var bool = this.validationService.validateAddress(address);
    var message = bool ? "Validated" : "Invalidated"
    console.log(message);
  }

  handleClick() {
    this.fetchFeedback(this.institutionAddress);
  }

  async fetchFeedback(institution : string) {
    await fetch(IP_ADDRESS + '/truffle/feedback?address=' + [institution] , {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        this.feedbacks = res.message
      })
  }
}
