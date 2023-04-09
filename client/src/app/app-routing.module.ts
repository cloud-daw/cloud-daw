import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/Authentication/auth.component';
import { SignUpComponent } from './components/Authentication/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ProjectsDashboardComponent } from './components/projects-dashboard/projects-dashboard.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'sign-up', component: SignUpComponent},
  { path: 'home', component: HomeComponent },
  { path: 'pw-reset', component: PasswordResetComponent },
  { path: 'verifyEmail', component: EmailVerificationComponent },
  { path: 'projectsDashboard', component: ProjectsDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
