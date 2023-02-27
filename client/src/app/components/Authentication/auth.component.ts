import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { tutorial } from 'src/app/globalVariables';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent {
    title = 'Log in';
    isTutorial = tutorial;
    constructor(public firebaseService : FirebaseService, public _router: Router){}
    errorShown = false;
    async onSignup(){
        // redirect to sign up page
        this._router.navigateByUrl('/sign-up')
    }
    async onSignin(email:string,password:string){
        await this.firebaseService.signin(email,password)
            .then(()=>{
                if (this.firebaseService.isLoggedIn) 
                    this._router.navigateByUrl('/home')
                })
            .catch (error =>{ this.errorShown = true })
            }
    async forgotPassword(){
        // redirect to password reset page
        this._router.navigateByUrl('/pw-reset')
    }
}