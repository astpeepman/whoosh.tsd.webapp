import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private error_message: Subject<string> = new Subject();
  public error$ = this.error_message.asObservable();

  constructor() { }

  public handle(message: string){
    this.error_message.next(message);
  }

  public handleHttpError(err: HttpErrorResponse){
    let message = `При выполнении HTTP запроса возникла ошибка. Код ошибки ${err.status}.`;

    if (err.message){
      message += `\n${err.message}`;
    }

    if (err.error){
      message += `\n${err.error}`;
    }

    this.error_message.next(message);
  }
}
