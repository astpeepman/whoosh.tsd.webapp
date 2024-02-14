import {LoginComponent} from "./components/login/login.component";
import {noAuthGuard} from "../../guards/auth.guard";
import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
