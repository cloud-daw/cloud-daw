import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainControlsComponent } from './components/controls/main-controls/main-controls.component';
import { MainVolumeComponent } from './components/controls/main-volume/main-volume/main-volume.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MidiNoteComponent } from './components/midi-controller/midi-note/midi-note/midi-note.component';
import { AngularFireModule } from '@angular/fire/compat';
import { HomeComponent } from './components/home/home.component';
import { FirebaseService } from './services/firebase.service';
import {environment} from '../environments/environment'
require('dotenv').config();

@NgModule({
  declarations: [
    AppComponent,
    MainControlsComponent,
    MainVolumeComponent,
    MidiNoteComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatSliderModule,
    AngularFireModule.initializeApp({
        apiKey: environment.apiKey,
        authDomain: environment.authDomain,
        projectId: environment.projectId,
        storageBucket: environment.storageBucket,
        messagingSenderId: environment.messagingSenderId,
        appId: environment.appId,
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
