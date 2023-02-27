import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/';
import { MessengerService } from '../globalVariables';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit, OnDestroy{
    isLoggedIn = false
    constructor(public firebaseAuth : AngularFireAuth, public _router: Router, 
        public messengerService: MessengerService) { }
    private messageSubscription: any;

    ngOnInit(): void {
        this.messageSubscription = this.messengerService.message.subscribe((m: any) => {});
    }
    ngOnDestroy(): void {
        this.messageSubscription.unsubscribe();
    }
    
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
            this.setIsTutorial(true);
            localStorage.setItem('isTutorial', "true")
        })
    }
    logout(){
        this.firebaseAuth.signOut()
        localStorage.removeItem('user')
        localStorage.setItem('isTutorial', "false")
        
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
    setIsTutorial(value: boolean) {
        // All components that are subscribed to the
        // messenger service receive the update
        this.messengerService.setMessage(value);
    }
}
