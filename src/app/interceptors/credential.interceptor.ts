import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from "../../environments/environment";

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const modifiedRequest = request.clone({
    withCredentials: environment.production
  });
  return next(modifiedRequest);
};
