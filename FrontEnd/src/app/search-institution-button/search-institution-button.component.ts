import { Component, OnInit } from '@angular/core';
const IP_ADDRESS = "http://localhost:3000";

@Component({
  selector: 'app-search-institution-button',
  templateUrl: './search-institution-button.component.html',
  styleUrls: ['./search-institution-button.component.scss'],
})

export class SearchInstitutionButtonComponent implements OnInit {
  institutionAddress : string
  constructor() { }

  ngOnInit() {}

  handleClick() {
    console.log("slurp me");
    console.log(this.institutionAddress);
    this.fetchFeedback(this.institutionAddress);
  }

  async fetchFeedback(institution : string) {
    await fetch(IP_ADDRESS + '/truffle/feedback?address=' + (institution), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        console.log(res.message)
      })
  }
}
