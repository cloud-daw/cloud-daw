import { Component, OnInit, Output, EventEmitter, NgModule, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectManagementService } from 'src/app/services/project-management.service';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { MakeInfoFromDbRes } from 'src/app/lib/db/model-project';
import { ProjectInfo } from 'src/app/models/db/project-info'
import { MakeNewProject } from 'src/app/lib/db/new-project'
import { InfoizeProject } from 'src/app/lib/db/infoize-project';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.css']
})

export class ProjectsDashboardComponent  implements OnInit, OnDestroy{
    projects: ProjectInfo[] = [];
    projectNames = new Set<string>;
    projectIds = new Set<string>; 
    constructor(public firebaseService: FirebaseService, public _router: Router, private cdr: ChangeDetectorRef) {  }
    
    projectName: string = '';
    project: ProjectInfo = InfoizeProject(MakeNewProject('a@a.com'));
    savedName: string | null = localStorage.getItem("openProjectName");
    openProject: boolean = localStorage.getItem('inProject') == "true";
    initialized: boolean = false
    private subscription!: Subscription;
    ngOnInit() {
        // I moved everything out of here hoping that updates in the database will no longer be 
        // reflected to make ngOnInit run repeatedly.
        this.handleEverything();
      }

      handleEverything () {
        const sessionEmail = JSON.parse(localStorage.getItem('user') || "").email;
        this.subscription = this.firebaseService.getProjectByEmail(sessionEmail).pipe().subscribe(x => {
          this.handleProjectByEmailResponse(x);
        });
      
        this.savedName = localStorage.getItem("openProjectName");
        if (this.savedName !== undefined && this.savedName !== "") {
          console.log(localStorage.getItem("openProjectName") as string)
          this.sendProjectNum(localStorage.getItem("openProjectName") as string);
        }
      }
      
      handleProjectByEmailResponse(x: any) {
        for (let i = 0; i < x.length; i++) {
          console.log(x[i].key);
          this.projectNames.add(x[i].name);
          this.projectIds.add(x[i].id);
          console.log("Grabbing the next one");
          this.projects.push(MakeInfoFromDbRes(x[i]));
        }
        console.log('projects: ', this.projectIds);
        this.initialized = true;
        this.projectName = localStorage.getItem("openProjectName") as string;
        this.project = this.getInfoFromName(this.projectName);
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

    onDeleteProject(nameClicked: string) {
        console.log("deleting " + nameClicked)

        // without this line, clicking on the delete button also clicks on the image under it 
        // which opens the project.
        event?.stopPropagation();

        // TO make the UI update automatically, I tried to make a new warning component,
        // then make the deletion in that component and navigate back here. I was hoping
        // that navigating back would refresh the component, but it did not.

        // localStorage.setItem('toBeDeleted', nameClicked)
        // this._router.navigateByUrl('/deleteWarning')

        this.firebaseService.deleteProject(nameClicked);
        
    }

    onLogOut(){
        this.firebaseService.logout();
        this._router.navigateByUrl('/login');
    }  

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
