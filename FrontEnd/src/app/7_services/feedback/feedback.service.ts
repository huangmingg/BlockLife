import { Injectable } from '@angular/core';
import { Feedback } from './feedback.model';
const IP_ADDRESS = "http://localhost:3000";


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbacks : Feedback[] = [];
  constructor() { }

  async retrieveAllFeedback(address : string) {
    await this.fetchFeedback(address);
    return [...this.feedbacks];
  }

  async fetchFeedback(address : string) {
    await fetch(IP_ADDRESS + '/truffle/feedback?address=' + (address), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        console.log(res)
        this.feedbacks = res.message
      })
  }


  async addFeedback(feedback: string, user: string, institution: string) {
    await fetch(IP_ADDRESS + '/truffle/feedback', {
      method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              feedback: feedback,
              institution: institution,
              user : user
            }) 
        })
      .catch((error) => {console.log(error)})
      .then((response : Response) => response.json())
      .then((res) => {
        console.log(res);
        // this.interactions = res.message
      })
  

  }



}
