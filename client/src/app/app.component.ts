import { Component } from '@angular/core';
import { ApiHttpService } from './services/httpservice.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudDaw';
  constructor(public ApiHttpService: ApiHttpService) { 
    this.status = 'no stat update';
    this.status$ = this.ApiHttpService.getStatus() //SAMPLE: grabs observable return from server
  }
  status: string;
  status$: Observable<any>;

  show() {
    this.status$.subscribe({
      next: s => {
        console.log('show, s');
        console.log(s);
        this.status = s.status || 'uh oh';
      },
      error: e => this.status = e.message || 'err',
      complete: () => console.log('complete'),
    });
  }
}
