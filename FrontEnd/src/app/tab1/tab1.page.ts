import { Component } from '@angular/core';
import { Router } from '@angular/router';
const IP_ADDRESS = "http://localhost:3000";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private route: Router) {}

  fetchAddress() {
    return new Promise(function(resolve, reject) {
      fetch(IP_ADDRESS + '/truffle/fetchAddress', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {
                  console.log(error);
                  reject(error);
              })
      .then((response : Response) => response.json())
      .then((res) => {
          console.log(res.message);
          resolve(JSON.parse(JSON.stringify(res.message)));
      });

    });

  }

  checkContractOwner() {
    return new Promise(function(resolve, reject) {
      fetch(IP_ADDRESS + '/truffle/createOrganization', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {
                  console.log(error);
                  reject(error);
              })
      .then((response : Response) => response.json())
      .then((res) => {
          console.log(res.message);
          resolve(JSON.parse(JSON.stringify(res.message)));
      });

    });
  }

  loginPage() {
    this.route.navigate(['/tabs/tab2']);
  }


}