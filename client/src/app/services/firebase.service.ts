import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

    isLoggedIn = false
    constructor(public firebaseAuth : AngularFireAuth, public _router: Router) { }
    async signin(email: string, password: string){
        await this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(res=>{
            console.log(res.user?.emailVerified);
            if(res.user?.emailVerified){
                this.isLoggedIn = true
                localStorage.setItem('user', JSON.stringify(res.user))
            } else {
                this._router.navigate(['/verifyEmail']);
            }
        })
    }
    async signup(email: string, password: string){
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(res=>{
            this.sendRegistrationEmail(res.user)
            localStorage.setItem('isTutorial', "true")
        })
    }
    logout(){
        this.firebaseAuth.signOut()
        // there is no need to automatically open tutorials if user is not new anymore.
        localStorage.setItem('isTutorial', "false")
        localStorage.removeItem('user')
    }
    passwordReset(email:string){
        this.firebaseAuth.sendPasswordResetEmail(email).then(()=>{
        }, err =>{
            alert('Something went wrong');
        })
    }
    sendRegistrationEmail(user: any) {
        user.sendEmailVerification().then((res: any)=>{
            this._router.navigate(['/verifyEmail'])
        })
    }
}
