import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../7_services/authentication/authentication.service';
import { Interaction } from '../../7_services/interaction/interaction.model';
import { InteractionService } from '../../7_services/interaction/interaction.service';

@Component({
  selector: 'app-view-history',
  templateUrl: 'view-history.page.html',
  styleUrls: ['view-history.page.scss']
})


export class ViewHistoryPage {
  address : string
  interactions: Interaction[] = []

  constructor(
    private interactionService: InteractionService,
    private alertController: AlertController,
    private authenticationService : AuthenticationService,
    ) {}

  async ngOnInit() {
    this.address = this.authenticationService.getUserAddress();
    await this.retrieveAllGivenInteractions(this.address); 
  }

  async doRefresh(refresher) {
    await this.retrieveAllGivenInteractions(this.address).then(() => {
      refresher.target.complete();
    })
  }

  async retrieveAllGivenInteractions(address : string) {
    this.interactions = await this.interactionService.retrieveAllGivenInteractions(address);
  }
  
  handleImage(interaction) {
    console.log('bringing up modal')
  }

  async handleInvalidate(item) {
    await this.presentAlertConfirm(item);
  }


  async presentAlertConfirm(item) {
    console.log(item)
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
            await this.interactionService.invalidateInteraction(item.hash, item.recipient, this.address);
          }
        }
      ]
    });
    await alert.present();
  }
}
