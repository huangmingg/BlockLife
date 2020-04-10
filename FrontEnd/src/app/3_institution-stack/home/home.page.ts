import { Component } from '@angular/core';
import { Feedback } from '../../7_services/feedback/feedback.model';
import { FeedbackService } from '../../7_services/feedback/feedback.service';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../7_services/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  feedbacks : Feedback[] = []
  name : string
  address : string
  constructor(
    private feedbackService : FeedbackService,
    private authenticationService : AuthenticationService,
    private alertController: AlertController
    ) {}

  async ngOnInit() {
    // should be dynamic retrieve when metamask is up
    this.address = this.authenticationService.getUserAddress();
    this.address = "0xa0ce3bdd2615fe4959e6fdf30955d73924da2e7c";
    this.authenticationService.retrieveName(this.address);
    this.name = await this.authenticationService.retrieveName(this.address);
    this.retrieveAllFeedback(this.address);
  }

  async refresh() {
    this.address = await this.authenticationService.getUserAddress();
    this.retrieveAllFeedback(this.address);
  }

  async retrieveAllFeedback(address : string) {
    this.feedbacks = await this.feedbackService.retrieveAllFeedback(address);
  }

  async handleInvalidate(item) {
    await this.presentAlertConfirm(item, this.address);
  }

  async presentAlertConfirm(item, address) {
    const alert = await this.alertController.create({
      header: 'Are you sure you wish to invalidate this feedback?',
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
            await this.feedbackService.deleteFeedback(item.id, this.address, this.address);
          }
        }
      ]
    });
    await alert.present();
  }


}