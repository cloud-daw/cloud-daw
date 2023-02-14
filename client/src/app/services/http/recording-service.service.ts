import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHttpService } from './httpservice.service'
import { Recording } from '../../models/recording/recording'

@Injectable({
  providedIn: 'root'
})
export class RecordingService {
  constructor(public httpService: ApiHttpService) {
    
  }
  GetRecording() {
    return this.httpService.get<Recording>('recording');
  }
}
