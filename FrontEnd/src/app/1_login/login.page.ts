import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../7_services/identification/identification.service';
import { AuthenticationService } from '../7_services/authentication/authentication.service';
import Web3 from 'web3';
import { WEB3 } from '../web3'
// var sigUtil = require('eth-sig-util')
var Eth = require('ethjs')
var ethUtil = require('ethereumjs-util');

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
    await this.sendChallenge(message, signature);

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
    return new Promise(function(resolve, reject) {
      provider.sendAsync({
        method,
        params,
        from
      }, async (err, result) => {
        if (err) {
          reject(err)
        }
        if (result.error) {
          reject(result.error)
        }
        resolve(result.result)
      })
    });
  } 

  async sendChallenge(message : string, signature : string) {
    await this.authenticationService.authenticateUser(message, signature);
  }

  async login() {
    // Should first verify using meta-auth, after that check if user is a registered organization, individual, or unregistered
    // address is static until meta-auth is implemented
    // var address = "0xB422d54Cc2b92A2462f035E31d34e11e61ff54a1" // registered individual
    // var address = "0xEa9764d165461e4e729886A023b2BBd389CDA959" // owner
    var address = "0xEa27b334967Fa7864748c39918EA6234Cd420747" // institution

    var userIdentity = await this.identificationService.getIdentity(address);
    console.log(`User Identity is ${userIdentity}`);
    // Based on user identity, will bring to different pages 
    // 1 => registered individual
    // 2 => registered institution
    // 3 => owner
    if (userIdentity == 1) {
      this.route.navigate(['/tabs']);
    } else if (userIdentity == 2) {
      this.route.navigate(['/institution']);
    } else if (userIdentity == 3) {
      this.route.navigate(['/owner']);
    } else {
      this.route.navigate(['/tabs']);
    }

  }
}
