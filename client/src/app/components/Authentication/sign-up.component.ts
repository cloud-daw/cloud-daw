import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
    selector: 'sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./auth.component.css'],
})
export class SignUpComponent {
    title = 'Sign Up';
    constructor(
        public firebaseService: FirebaseService,
        public _router: Router
    ) { }
    errorShown = false;
    passwordMismatch = false;
    async onSignup(email: string, password: string, password2: string) {
        // if passowords don't match, do not create account.
        if (password != password2) {
            this.passwordMismatch = true;
            return;
        }
        await this.firebaseService
            .signup(email, password)
            .then(() => {
                if (this.firebaseService.isLoggedIn && password == password2)
                    this._router.navigateByUrl('/home');
            })
            .catch((error) => {
                this.errorShown = true;
                this.passwordMismatch = false;
            });
    }
    async onSignin() {
        // redirect to login
        this._router.navigateByUrl('/login');
    }
}
