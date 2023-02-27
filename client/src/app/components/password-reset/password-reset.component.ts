import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['../Authentication/auth.component.css']
})
export class PasswordResetComponent {
    constructor(private firebaseService : FirebaseService){}
    async forgotPassword(email:string){
        this.firebaseService.passwordReset(email);
    }
}
