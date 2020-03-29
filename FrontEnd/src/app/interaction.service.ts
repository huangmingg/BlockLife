import { Injectable } from '@angular/core';
import { Interaction } from './tab1/tab1.model';

const IP_ADDRESS = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})

export class InteractionService {
  private interactions : Interaction[] = [];

  constructor() {}

  async retrieveAllInteractions() {
    await this.fetchInteractions();
    return [...this.interactions];
  }

  retrieveInteraction(interactionHash : string) {
    return this.interactions.find(interaction => {
      return interaction.hash === interactionHash;
    })
  }

  async fetchInteractions() {
    await fetch(IP_ADDRESS + '/truffle/profile', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        this.interactions = res.message
      })
  }

}
