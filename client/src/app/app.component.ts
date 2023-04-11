import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent {
    title = 'CloudDaw';
    constructor(public _router: Router) {}
    ngOnInit() {
      if (localStorage.getItem('user') !== null) {
        //is signed in
        this._router.navigateByUrl('/projectsDashboard');
      }
      else {
        //is not signed in
        this._router.navigateByUrl('/login');
      }
    }
}
