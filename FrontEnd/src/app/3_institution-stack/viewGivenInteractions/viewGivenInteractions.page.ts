import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../7_services/authentication/authentication.service';
import { Interaction } from '../../7_services/interaction/interaction.model';
import { InteractionService } from '../../7_services/interaction/interaction.service';

@Component({
  selector: 'app-viewGivenInteractions',
  templateUrl: 'viewGivenInteractions.page.html',
  styleUrls: ['viewGivenInteractions.page.scss']
})


export class ViewGivenInteractionsPage {
  address : string
  interactions: Interaction[] = []

  constructor(
    private interactionService: InteractionService,
    private alertController: AlertController,
    private authenticationService : AuthenticationService
    ) {}

  ngOnInit() {}

  async refresh(){
    this.address = await this.authenticationService.getUserAddress();
    await this.retrieveAllGivenInteractions(this.address);
  }

  async retrieveAllGivenInteractions(address : string) {
    this.interactions = await this.interactionService.retrieveAllGivenInteractions(address);
  }
  
  handleImage(interaction) {
    console.log('bringing up modal')
  }

  async handleInvalidate(item) {
    await this.presentAlertConfirm(item, this.address);
  }


  async presentAlertConfirm(item, address) {
    const alert = await this.alertController.create({
      header: 'Are you sure you wish to invalidate this interaction?',
      message: 'This process is irreversible!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (cancel) => {            
          }
        }, {
          text: 'Okay',
          handler: async () => {
            await this.interactionService.invalidateInteraction(item.hash, this.address);
          }
        }
      ]
    });
    await alert.present();
  }
}
