import { Component } from '@angular/core';
import { Interaction } from '../../7_services/interaction/interaction.model';
import { InteractionService } from '../../7_services/interaction/interaction.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})

export class ProfilePage {
  interactions: Interaction[] = []

  constructor(private interactionService: InteractionService) {}

  ngOnInit() {
    // should be dynamic retrieve when metamask is up
    var address = "0x8B6796841E411e725C16F18894c734FA44Fc0cD5"
    this.retrieveAllInteractions(address);
  }

  async retrieveAllInteractions(address : string) {
    this.interactions = await this.interactionService.retrieveAllInteractions(address);
  }

  async remove(item) {
    console.log(item);
  }
}