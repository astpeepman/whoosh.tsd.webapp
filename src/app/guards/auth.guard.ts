import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {UserService} from "../modules/user/services/user.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const router: Router = inject(Router);
  const user_service = inject(UserService);

  if (!user_service.is_auth){
    router.navigate(['/user/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};

export const noAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const router: Router = inject(Router);
  const user_service = inject(UserService);

  if (user_service.is_auth){
    router.navigate(['/']);
    return false;
  }

  return true;
}
