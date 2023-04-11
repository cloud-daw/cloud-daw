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
    constructor(public firebaseService: FirebaseService, public _router: Router) {  }
    
    projectName: string = '';
    project: ProjectInfo = InfoizeProject(MakeNewProject('a@a.com'));
    savedName: string | null = localStorage.getItem("openProjectName");
    openProject: boolean = localStorage.getItem('inProject') == "true";
    initialized: boolean = false
    ngOnInit() {
        // localStorage.setItem('inProject', "false")
        const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
        this.firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => {
            for (let i = 0; i < x.length; i++) {
                console.log(x[i].key);
                this.projectNames.add(x[i].name)
                this.projectIds.add(x[i].id)
                this.projects.push(MakeInfoFromDbRes(x[i]))
            }
            console.log('projects: ', this.projectIds)
            this.initialized = true;
            this.projectName = localStorage.getItem("openProjectName") as string;
            this.project = this.getInfoFromName(this.projectName)
        });
        this.savedName = localStorage.getItem("openProjectName");
        if (this.savedName !== undefined && this.savedName !== "") {
            console.log(localStorage.getItem("openProjectName") as string)
            this.sendProjectNum(localStorage.getItem("openProjectName") as string);
        }
    }

    
    // openProject: boolean = false;
    sendProjectNum(nameClicked: string) {
        
        this.project = this.getInfoFromName(nameClicked);
        this.openProject = true;
        this.projectName = nameClicked;
        localStorage.setItem('inProject', "true")
        localStorage.setItem('openProjectName', nameClicked)
        console.log("sentProjectName: " + nameClicked)
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
        this.validateProjectName(projectNameInput).then(()=>{
            localStorage.setItem('inProject', "true")
            const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
            const newProjInfo = InfoizeProject(MakeNewProject(sessionEmail, projectNameInput))
            this.firebaseService.initProject(newProjInfo);
            this.project = newProjInfo;
            this.openProject = true;
            this.projectName = projectNameInput;
            localStorage.setItem('openProjectName', projectNameInput)
        })
        .catch(()=>{
            alert("Invalid Project Name. Name should be unique and 1-15 characters long");
        })
    }
    onCloseHome() {
        this.openProject = false;
      }
    
    async validateProjectName(name: string) : Promise<Boolean>{
        
        const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email
        return new Promise((resolve, reject) => {
            if (name.replace(/\s/g, "") === "") {
                reject(false);
            }
            if (name.length > 15) {
                reject(false);
            }
            this.firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => {
                for (let i = 0; i < x.length; i++) {
                    if (name === x[i].name) {
                        reject(false);
                    }
                }
                resolve(true);
            });
            
        })
    }
    onLogOut(){
        this.firebaseService.logout();
        this._router.navigateByUrl('/login');
    }  
}
