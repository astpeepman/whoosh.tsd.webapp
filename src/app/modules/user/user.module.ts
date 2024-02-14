import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {UserRoutingModule} from "./user.routes";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectComponent} from "../layout/components/select/select.component";



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    SelectComponent
  ]
})
export class UserModule { }
