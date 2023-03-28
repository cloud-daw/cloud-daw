import { Component, OnInit, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.css']
})

export class ProjectsDashboardComponent  implements OnInit{
    projects: any[] = [];
    projectNames = new Set<string>;
    projectIds = new Set<string>; 
    constructor(public firebaseService: FirebaseService) { 

        // const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
        // firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => console.log(x[0]));
        // firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => this.projects.push(x.email));
        
    }
    

    ngOnInit() {

        const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
        this.firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => {
            this.projectNames.add(x[0].name)
            this.projectIds.add(x[0].id)
        });
        
    }

    projectName: string = '';
    openProject: boolean = false;
    sendProjectNum(nameClicked: string) {
        
        this.openProject = true;
        this.projectName = nameClicked;

    }

    async submitProjTitle(projectNameInput: string) {
        this.openProject = true;
        this.projectName = projectNameInput;
    }

        
}
