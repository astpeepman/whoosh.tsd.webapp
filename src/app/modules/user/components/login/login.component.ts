import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {SelectOption} from "../../../layout/components/select/select.component";
import {response} from "express";
import {Router} from "@angular/router";
import {prepareFormHttpError} from "../../../main/utils/http.error";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  protected login_list: SelectOption[] = [];
  protected return_url: string = '';



  @ViewChild('usernameInput') username_input: HTMLInputElement;

  protected form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  constructor(
    private user_service: UserService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.getLoginList();
  }

  //Получаем список доступных логинов
  protected getLoginList(){
    this.login_list = [];
    this.user_service.login_list().subscribe((login_list: string[])=>{
      if (login_list)
        login_list.forEach((login_item)=>{
          this.login_list.push({
            label: login_item,
            value: login_item,
          })
        })
    });
  }

  selectLogin(login: string){
    this.form.controls.username.setValue(login);
  }

  submit(){
    this.deleteServerError();
    if (this.form.invalid){
      return;
    }

    this.form.disable();

    this.user_service.auth(
      this.form.controls.username.value,
      this.form.controls.password.value
    ).subscribe({
      next: (response)=>{
        this.router.navigate([this.return_url]);
      },
      error: (err)=>{
        prepareFormHttpError(err, this.form)
      },
      complete: ()=>{
        this.form.enable();
      }
    })
  }


  private deleteServerError(){
    Object.entries(this.form.controls).forEach(
      ([key, control]) => {
        if (control?.errors && control?.errors['server'])
          delete control.errors['server'];
      }
    );

    this.form.setErrors({server: null});
    this.form.updateValueAndValidity();
  }
}
