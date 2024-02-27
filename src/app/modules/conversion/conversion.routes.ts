import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DocumentComponent} from "./components/document/document.component";
import {authGuard} from "../../guards/auth.guard";
import {GoodListComponent} from "./components/good.list/good.list.component";
import {RemainsComponent} from "./components/remains/remains.component";


export const routes: Routes = [
  {
    path: 'document',
    component: DocumentComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RemainsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'good-list',
        component: GoodListComponent,
        canActivate: [authGuard],
      }
    ]
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversionRoutingModule { }
