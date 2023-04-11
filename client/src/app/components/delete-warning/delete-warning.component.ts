import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router, NavigationExtras  } from '@angular/router';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.css']
})
export class DeleteWarningComponent {
    deleteName: string | null = "";
    constructor(public firebaseService: FirebaseService, public _router: Router) {}
    onConfirm(){
        this.deleteName = localStorage.getItem('toBeDeleted')
        if (this.deleteName) {
            const navigationExtras: NavigationExtras = {
                skipLocationChange: true
              };

            console.log("about to delete: ", this.deleteName)
            this.firebaseService.deleteProject(this.deleteName);
            this._router.navigateByUrl('/projectsDashboard', navigationExtras )
        }
    }
    onDeny() {
        this._router.navigateByUrl('/projectsDashboard')
    }
}
