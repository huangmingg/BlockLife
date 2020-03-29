import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentificationService } from '../identification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private route: Router, private identificationService: IdentificationService) { }

  ngOnInit() {
  
  
  }

  async login() {
    //log in logic
    // Should first verify using meta-auth, after that check if user is a registered organization, individual, or unregistered
    // address is static until meta-auth is implemented
    var address = "0xB422d54Cc2b92A2462f035E31d34e11e61ff54a1" 

    var userIdentity = await this.identificationService.getIdentity(address);
    console.log(`User Identity is ${userIdentity}`);
    // Based on user identity, will bring to different pages 
    // 1 => registered individual
    // 2 => registered organization
    // 3 => owner
    if (userIdentity == 1) {
      this.route.navigate(['/tabs']);
    } else if (userIdentity == 2) {
      this.route.navigate(['/tabs']);
    } else if (userIdentity == 3) {
      this.route.navigate(['/tabs']);
    } else {
      this.route.navigate(['/tabs']);
    }

  }
}
