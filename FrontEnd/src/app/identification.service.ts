import { Injectable } from '@angular/core';

const IP_ADDRESS = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class IdentificationService {
  private userIdentity : number = 0

  constructor() { }

  async getIdentity(address : string) {
    await this.checkIdentity(address);
    return this.userIdentity;
  }

  async checkIdentity(address : string) {
    await fetch(IP_ADDRESS + '/truffle/identity?address=' + [address], {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        this.userIdentity = res.message
      });

  }

}
