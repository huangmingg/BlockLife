import { Injectable } from '@angular/core';
import { Interaction } from './interaction.model';
import { HttpClient } from '@angular/common/http';
// const request = require('request');

const IP_ADDRESS = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})

export class InteractionService {
  private interactions : Interaction[] = [];

  constructor(private http: HttpClient) {}

  async retrieveAllInteractions(address : string) {
    await this.fetchInteractions(address);
    return [...this.interactions];
  }

  retrieveInteraction(interactionHash : string) {
    return this.interactions.find(interaction => {
      return interaction.hash === interactionHash;
    })
  }

  async fetchInteractions(address : string) {
    await fetch(IP_ADDRESS + '/truffle/profile?address=' + (address), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        if (res.success) {
            console.log(res)
            this.interactions = res.message
        }
      })
  }


  async addInteraction(file: string, recipient: string, institution: string) {
    await fetch(IP_ADDRESS + '/truffle/hash', {
      method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              file: file,
              recipient: recipient,
              institution: institution
            }) 
        })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        console.log(res);
        // this.interactions = res.message
      })
  

  }

}
