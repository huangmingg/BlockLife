import { Component } from '@angular/core';
import { Router } from '@angular/router';

const IP_ADDRESS = "http://localhost:3000";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  accountAddress = ""
  interactionHashes = []

  constructor(private route: Router) {}

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

  async fetchProfile() {
    await fetch(IP_ADDRESS + '/truffle/profile', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {this.interactionHashes = res.message});
  }

  loginPage() {
    this.route.navigate(['/tabs/tab2']);
  }


}