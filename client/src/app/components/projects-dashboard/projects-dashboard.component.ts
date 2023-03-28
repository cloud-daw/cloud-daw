import { Component, OnInit, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { MakeInfoFromDbRes } from 'src/app/lib/db/model-project';
import { ProjectInfo } from 'src/app/models/db/project-info'
import { MakeNewProject } from 'src/app/lib/db/new-project'
import { InfoizeProject } from 'src/app/lib/db/infoize-project';


@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.css']
})

export class ProjectsDashboardComponent  implements OnInit{
    projects: ProjectInfo[] = [];
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
            for (let i = 0; i < x.length; i++) {
                console.log('x:', x)
                this.projectNames.add(x[i].name)
                this.projectIds.add(x[i].id)
                this.projects.push(MakeInfoFromDbRes(x[i]))
            }
            console.log('projects: ', this.projects)
        });
    }

    projectName: string = '';
    project: ProjectInfo = InfoizeProject(MakeNewProject('a@a.com'));
    openProject: boolean = false;
    sendProjectNum(nameClicked: string) {
        this.project = this.getInfoFromName(nameClicked);
        console.log('sending project, ', this.project)
        this.openProject = true;
        this.projectName = nameClicked;

    }
    getInfoFromName(name: string) : ProjectInfo {
        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].name === name) {
                return this.projects[i];
            }
        }
        return this.projects[0];
    }

    async submitProjTitle(projectNameInput: string) {
        const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
        const newProjInfo = InfoizeProject(MakeNewProject(sessionEmail, projectNameInput))
        this.firebaseService.initProject(newProjInfo);
        this.project = newProjInfo;
        this.openProject = true;
        this.projectName = projectNameInput;
    }

        
}
