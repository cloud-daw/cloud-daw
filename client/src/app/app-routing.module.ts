import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/Authentication/auth.component';
import { SignUpComponent } from './components/Authentication/sign-up.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'sign-up', component: SignUpComponent},
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
