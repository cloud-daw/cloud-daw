import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class MessengerService {

    private messageSource: BehaviorSubject<boolean> = new BehaviorSubject(false); 
    public message = this.messageSource.asObservable();

    public setMessage(value: boolean) {
        this.messageSource.next(value);
    }
}

export const tutorial:boolean = false;