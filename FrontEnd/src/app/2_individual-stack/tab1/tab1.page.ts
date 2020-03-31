import { Component } from '@angular/core';
import { Interaction } from './tab1.model';
import { InteractionService } from '../../7_services/interaction/interaction.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  interactions: Interaction[] = []

  constructor(private interactionService: InteractionService) {}

  ngOnInit() {
    var address = "0x8B6796841E411e725C16F18894c734FA44Fc0cD5"
    this.retrieveAllInteractions(address);
  }

  async retrieveAllInteractions(address : string) {
    this.interactions = await this.interactionService.retrieveAllInteractions(address);
  }
}