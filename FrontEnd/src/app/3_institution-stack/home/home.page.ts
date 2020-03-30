import { Component } from '@angular/core';
import { Feedback } from '../../7_services/feedback/feedback.model';
import { FeedbackService } from '../../7_services/feedback/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  feedbacks : Feedback[] = []
  constructor(private feedbackService : FeedbackService) {}

  ngOnInit() {
    // should be dynamic retrieve when metamask is up
    var address = "0xEa27b334967Fa7864748c39918EA6234Cd420747";
    this.retrieveAllFeedback(address);
  }

  async retrieveAllFeedback(address : string) {
    this.feedbacks = await this.feedbackService.retrieveAllFeedback(address);
  }

}