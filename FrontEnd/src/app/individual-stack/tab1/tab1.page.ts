import { Component } from '@angular/core';
import { Interaction } from './tab1.model';
import { InteractionService } from '../../interaction.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  interactions: Interaction[] = []

  constructor(private interactionService: InteractionService) {}

  ngOnInit() {
    this.retrieveAllInteractions();
  }

  async retrieveAllInteractions() {
    this.interactions = await this.interactionService.retrieveAllInteractions();
  }
}