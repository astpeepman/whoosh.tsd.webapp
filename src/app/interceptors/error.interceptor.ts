import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, retry, throwError, timer} from "rxjs";
import {ErrorService} from "../modules/main/services/error.service";
import {inject} from "@angular/core";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const error_service = inject(ErrorService);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (err: HttpErrorResponse)=>{
        if(err.status >= 500){
          return timer(1000);
        }
        return throwError(()=>err);
      }
    }),
    catchError((err)=>{
      error_service.handleHttpError(err);
      return throwError(()=>err);
    })
  );
};
