import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

    

    private messageSource = new BehaviorSubject<number>(-5);
    currentProject = this.messageSource.asObservable();

    constructor() { }

    
    changeProject (project: number) {
        this.messageSource.next(project);
    }
}
