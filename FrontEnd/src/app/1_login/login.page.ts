import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../7_services/identification/identification.service';
import { AuthenticationService } from '../7_services/authentication/authentication.service';
import Web3 from 'web3';
import { WEB3 } from '../web3'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    @Inject(WEB3) private web3: Web3,
    private route: Router, 
    private identificationService: IdentificationService,
    private authenticationService: AuthenticationService) {}
    
  ngOnInit() {
  }

  async handleClick() {
    var address = await this.metaMaskInjection();
    var challenge = await this.generateChallenge(address);
    var signature = await this.signChallenge(challenge, address);
    var message = challenge[1]['value']
    var result = await this.sendChallenge(message, signature);
    if (!result) {alert("Authentication failed, please try again!");return;} 
    var identity = await this.identificationService.getIdentity(address);
    this.handleIdentity(identity);
  }

  async metaMaskInjection() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
    }
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0].toLowerCase();
  }

  async generateChallenge(address : string) {
    var challengeObject = await this.authenticationService.generateChallenge(address);
    return challengeObject;
  }

  async signChallenge(challenge : Object[], address : string) {
    const from = address;
    const params = [challenge, from];
    const method = 'eth_signTypedData';
    const provider = this.web3.currentProvider;
    return new Promise<string>(function(resolve, reject) {
      let output : string;
      provider.sendAsync({
        method,
        params,
        from
      }, async (err, result) => {
        if (err) {
          output = err
          reject(output)
        }
        if (result.error) {
          output = result.error
          reject(output)
        }
        output = result.result
        resolve(output)
      })
    });
  } 

  async sendChallenge(message : string, signature : string) {
    var result : boolean = await this.authenticationService.authenticateUser(message, signature);
    return result;
  }

  // 1 represents registered individual
  // 2 represents registered institutions
  // 3 represents contract owner
  // else (0) represents new user
  async handleIdentity(identity : number) {
    if (identity == 1) {
      this.route.navigate(['/tabs']);
    } else if (identity == 2) {
      this.route.navigate(['/institution']);
    } else if (identity == 3) {
      this.route.navigate(['/owner']);
    } else {
      this.route.navigate(['/tabs']);
    }
  }
}
