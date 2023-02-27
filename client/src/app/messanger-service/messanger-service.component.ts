import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-messanger-service',
    templateUrl: './messanger-service.component.html',
    styleUrls: ['./messanger-service.component.css']
})
@Injectable()
export class MessangerServiceComponent {



    private messageSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public message = this.messageSource.asObservable();

    public setMessage(value: boolean) {
        this.messageSource.next(value);
    }

}
