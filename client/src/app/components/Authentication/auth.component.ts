import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { HomeComponent } from '../home/home.component';

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent {
    title = 'Log in';
    isSignedIn = false
    constructor(public firebaseService : FirebaseService){}
    ngOnInit(){
        if(localStorage.getItem('user') !== null)
            this.isSignedIn = true
        else
            this.isSignedIn = false
    }
    async onSignup(email:string,password:string){
        await this.firebaseService.signup(email,password)
            if(this.firebaseService.isLoggedIn)
                this.isSignedIn = true
    }
    async onSignin(email:string,password:string){
        await this.firebaseService.signin(email,password)
            if(this.firebaseService.isLoggedIn)
                this.isSignedIn = true
    }
    handleLogout(){
        this.isSignedIn = false
    }
}