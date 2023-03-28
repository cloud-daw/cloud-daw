import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainControlsComponent } from './components/controls/main-controls/main-controls.component';
import { MainVolumeComponent } from './components/controls/main-volume/main-volume/main-volume.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AuthComponent } from './components/Authentication/auth.component';
import { FirebaseService } from './services/firebase.service';
import { environment } from './environments/environment';
import { HomeComponent } from './components/home/home.component';
import { MidiTrackComponent } from './components/midi/midi-editor/midi-track/midi-track.component';
import { SliderComponent } from './components/controls/slider/slider/slider.component';
import { SignUpComponent } from './components/Authentication/sign-up.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { MidiBlockComponent } from './components/midi/midi-editor/midi-block/midi-block.component';
import { SliderGridComponent } from './components/controls/slider/slider-grid/slider-grid.component';
import { SelectInstrumentComponent } from './components/select-instrument/select-instrument.component';
import { MidiNotesContainerComponent } from './components/midi/midi-editor/notes/midi-notes-container/midi-notes-container.component';
import { MidiNoteComponent } from './components/midi/midi-editor/notes/midi-note/midi-note.component';
import { MidiEditorComponent } from './components/midi/midi-editor/midi-editor.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    MainControlsComponent,
    MainVolumeComponent,
    MidiTrackComponent,
    HomeComponent,
    AuthComponent,
    SliderComponent,
    SignUpComponent,
    MidiBlockComponent,
    SliderGridComponent,
    PasswordResetComponent,
    EmailVerificationComponent,
    MidiBlockComponent,
    SelectInstrumentComponent,
    MidiNotesContainerComponent,
    MidiNoteComponent,
    MidiEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    AngularFireModule.initializeApp({
        apiKey: environment.firebase.apiKey,
        authDomain: environment.firebase.authDomain,
        projectId: environment.firebase.projectId,
        storageBucket: environment.firebase.storageBucket,
        messagingSenderId: environment.firebase.messagingSenderId,
        appId: environment.firebase.appId,
    }),
    AngularFireDatabaseModule,
    DragDropModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
