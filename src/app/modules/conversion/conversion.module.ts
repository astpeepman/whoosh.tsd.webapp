import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConversionRoutingModule} from "./conversion.routes";
import {DocumentComponent} from "./components/document/document.component";
import {HeaderComponent} from "../layout/components/header/header.component";
import {GoodListComponent} from "./components/good.list/good.list.component";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {PopupComponent} from "../layout/components/popup/popup.component";
import {SelectComponent} from "../layout/components/select/select.component";



@NgModule({
  declarations: [
    DocumentComponent,
    GoodListComponent
  ],
  imports: [
    CommonModule,
    ConversionRoutingModule,
    HeaderComponent,
    LazyLoadImageModule,
    PopupComponent,
    SelectComponent,
  ]
})
export class ConversionModule { }
