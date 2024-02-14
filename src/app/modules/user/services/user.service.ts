import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "../../../libs/cookie-service/cookie.service";
import {IToken} from "../models/token";
import {environment} from "../../../../environments/environment";
import {IListResponse} from "../../main/models/response";
import {IUser} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user_subject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  public user$: Observable<IUser> = this.user_subject.asObservable();

  constructor(
    private http: HttpClient,
    private cookies: CookieService
  ) { }

  public auth(username: string, password: string): Observable<IToken>{
    let url = environment.api + "login/auth";

    return this.http.post<IToken>(
      url,
      {
        login: username,
        password: password
      }
    ).pipe(
      tap((token)=>{
        this.cookies.set("auth_token", token.token, 3600 * 24 * 30, null, null, true, "None");
      })
    );
  }

  public login_list(): Observable<string[]>{
    let url = environment.api + "login/userlist";

    return this.http.get<IListResponse<string>>(
      url
    ).pipe(
      map((login_list: IListResponse<string>)=>{
        return login_list.results;
      }),
      catchError((err)=>{
        return of(null);
      })
    );
  }

  public removeToken(){
    this.cookies.delete('auth_token');
  }

  public get(){
    const url = environment.api + "user";
    return this.http.get<IUser>(
      url
    ).pipe(
      tap(
        (user: IUser)=>{
          this.user_subject.next(user);
        }
      )
    )
  }

  get token(): string{
    return this.cookies.get("auth_token");
  }

  get is_auth(): boolean{
    return this.cookies.check("auth_token");
  }
}
