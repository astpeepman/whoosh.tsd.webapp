import { Routes } from '@angular/router';
import {MainComponent} from "./modules/main/components/main/main.component";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  }
];
