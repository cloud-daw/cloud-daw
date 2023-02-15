import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent {
    title = 'Log in';
    constructor(public firebaseService : FirebaseService, public _router: Router){}
    async onSignup(email:string,password:string){
        await this.firebaseService.signup(email,password)
            if (this.firebaseService.isLoggedIn) {
                this._router.navigateByUrl('/home')
            }
    }
    async onSignin(email:string,password:string){
        await this.firebaseService.signin(email,password)
            if (this.firebaseService.isLoggedIn) 
                this._router.navigateByUrl('/home')
            }
}