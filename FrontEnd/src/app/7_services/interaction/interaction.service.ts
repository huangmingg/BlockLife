import { Injectable } from '@angular/core';
import { Interaction } from '../../2_individual-stack/tab1/tab1.model';
import Config from '../../env.js'

@Injectable({
  providedIn: 'root'
})

export class InteractionService {
  private interactions : Interaction[] = [];

  constructor() {}

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
    await fetch(Config.IP_ADDRESS + '/truffle/profile?address=' + (address), {
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
