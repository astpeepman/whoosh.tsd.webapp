import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {UserService} from "../modules/user/services/user.service";
import {inject} from "@angular/core";
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user_service = inject(UserService);
  const router: Router = inject(Router);

  if (user_service.is_auth){
    const request = req.clone({
      setHeaders: {
        Token: user_service.token
      }
    });

    return next(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        if (err.status === 401){
          user_service.removeToken();
          router.navigate(['/user/login']);
        }

        return throwError(()=>err);
      })
    );
  }

  return next(req).pipe(
    catchError((err)=>{
      if (err.status === 401){
        router.navigate(['/user/login']);
      }
      return throwError(()=>err);
    })
  );
};
