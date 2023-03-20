import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProjectInfo } from '../models/db/project-info';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

    isLoggedIn = false
    projectsRef: AngularFireList<any>
    constructor(public firebaseAuth: AngularFireAuth, public _router: Router, private db: AngularFireDatabase) { 
        this.projectsRef = db.list('projects');
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
        })
    }
    logout(){
        this.firebaseAuth.signOut()
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

    getProjectByEmail(email: string): Observable<any> {
        return this.projectsRef.snapshotChanges()
            .pipe(
                map(changes => changes.map(
                    c => ({ key: c.payload.key, ...c.payload.val() }))
                    .filter(project => project.email === email)
                )
            );
    }

    initProject(project: ProjectInfo) {
        console.log('in init service', project);
        this.projectsRef.push(project);
    }

    saveProject(key: string, updatedProject: ProjectInfo) {
        console.log('in save project');
        this.projectsRef.update(key, updatedProject);
    }
}
