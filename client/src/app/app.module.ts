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
        apiKey: "AIzaSyCRqEzoN5AkCccTaFLkQo_GJx4qHulsng4",
        authDomain: "clouddaw-a7e78.firebaseapp.com",
        projectId: "clouddaw-a7e78",
        storageBucket: "clouddaw-a7e78.appspot.com",
        messagingSenderId: "612080396120",
        appId: "1:612080396120:web:1293649897f5da6b76672d"
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
