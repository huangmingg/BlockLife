import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../7_services/validation/validation.service';
import { Interaction } from '../7_services/interaction/interaction.model';
import { InteractionService } from '../7_services/interaction/interaction.service';

const IP_ADDRESS = "http://localhost:3000";

@Component({
  selector: 'app-search-user-button',
  templateUrl: './search-user-button.component.html',
  styleUrls: ['./search-user-button.component.scss'],
})
export class SearchUserButtonComponent implements OnInit {
  userAddress : string
  interactions: Interaction[] = []

  constructor(private validationService: ValidationService, private interactionService : InteractionService) {}

  ngOnInit() {}

  validateInput(address) {
    this.userAddress = address
    var bool = this.validationService.validateAddress(address);
    var message = bool ? "Validated" : "Invalidated"
    console.log(message);
  }

  async handleClick() {
    this.interactions = await this.interactionService.retrieveAllInteractions(this.userAddress);
  }

  async remove(item) {
    console.log(item);
    console.log(item.hash);
    this.interactionService.deleteInteraction(item.hash, "0x2192e76c85648edcdef826c07c9464788747c326");
  }

}
