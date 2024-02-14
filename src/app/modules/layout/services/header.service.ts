import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {IHeaderTitle} from "../models/header";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private title: BehaviorSubject<IHeaderTitle> = new BehaviorSubject<IHeaderTitle>(null);
  public title$ = this.title.asObservable();

  constructor() { }

  public setTitle(title: IHeaderTitle){
    this.title.next(title);
  }

  public removeTitle(){
    this.title.next(null);
  }
}
