import {Routes} from "@angular/router";
import {AppSideLoginComponent} from "./side-login/side-login.component";
import {LoginComponent} from "./login/login.component";


export const AuthenticationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
