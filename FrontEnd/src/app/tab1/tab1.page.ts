import { Component } from '@angular/core';
import { Router } from '@angular/router';
const IP_ADDRESS = "http://localhost:3000";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
<<<<<<< HEAD
  accountAddress = ""
  
  constructor() {}
=======

  constructor(private route: Router) {}
>>>>>>> 28a73791a0fec4fc544b4cb38e97d2350c1e7881

  async fetchAddress() {    
      await fetch(IP_ADDRESS + '/truffle/fetchAddress', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {this.accountAddress = res.message});
  }

  checkContractOwner() {
    return new Promise(function(resolve, reject) {
      fetch(IP_ADDRESS + '/truffle/getContractOwner', {
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

  createOrganization() {
    var name = "National University of Singapore"
    var UEN = "200604346E"
    var industry = "UNIVERSITIES"
    var listed_address = "21 LOWER KENT RIDGE ROAD SINGAPORE 119077"
    return new Promise(function(resolve, reject) {
      fetch(IP_ADDRESS + '/truffle/createOrganization', {
          method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name: name,
                  UEN: UEN,
                  industry: industry,
                  listed_address: listed_address
                }) 
      })
      .catch((error) => {
          console.log(error);
          reject(error)
      })
      .then((response : Response) => response.json())
      .then((res) => {
          if (res.success) {
              resolve(JSON.parse(JSON.stringify(res)))
          } else {
              console.log('Creation failed over on server side, please try again')
          }
      })
    });
  }

  retrieveBalance() {
    return new Promise(function(resolve, reject) {
      fetch(IP_ADDRESS + '/truffle/getBalance', {
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