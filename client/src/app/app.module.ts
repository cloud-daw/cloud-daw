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
import { AuthComponent } from './components/Authentication/auth.component';
import { FirebaseService } from './services/firebase.service';

import { environment } from './environments/environment';
import { HomeComponent } from './components/home/home.component';
import { MidiTrackComponent } from './components/midi-track/midi-track.component';
import { TrackContainerComponent } from './components/track-container/track-container.component';
import { SignUpComponent } from './components/Authentication/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    MainControlsComponent,
    MainVolumeComponent,
    MidiNoteComponent,
    MidiTrackComponent,
    TrackContainerComponent,
    HomeComponent,
    AuthComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatSliderModule,
    AngularFireModule.initializeApp({
        apiKey: environment.firebase.apiKey,
        authDomain: environment.firebase.authDomain,
        projectId: environment.firebase.projectId,
        storageBucket: environment.firebase.storageBucket,
        messagingSenderId: environment.firebase.messagingSenderId,
        appId: environment.firebase.appId,
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
