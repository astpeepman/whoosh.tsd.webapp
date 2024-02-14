import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from "../../environments/environment";

export const serverAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authorization = 'Basic ' + btoa(environment.server_auth.username + ':' + environment.server_auth.password);
  const request = req.clone({
    setHeaders: {
      Authorization: authorization
    }
  });
  return next(request);
};
