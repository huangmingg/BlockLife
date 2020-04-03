import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // This just tests the regex, actual checksum is performed over at the server.  
  validateAddress(address) {
    return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
  }

}
