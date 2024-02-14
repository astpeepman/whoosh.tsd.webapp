import {Component, ViewChild} from '@angular/core';
import {HeaderComponent} from "../../../layout/components/header/header.component";
import {HeaderService} from "../../../layout/services/header.service";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {GoodService} from "../../services/good.service";
import {IListResponse} from "../../models/response";
import {Good} from "../../models/good";
// import {ScannerComponent} from "../../../scanner/components/scanner/scanner.component";
// import {PopupComponent} from "../../../layout/components/popup/popup.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    LazyLoadImageModule,
    // ScannerComponent,
    // PopupComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  // @ViewChild('scanner') scanner!: ScannerComponent
  // @ViewChild('popup') popup!: PopupComponent;

  // startCam(){
  //   this.popup.open();
  //   this.scanner.start();
  // }
  //
  // onDisplay(display: boolean){
  //   if (!display){
  //     this.scanner.stop();
  //   }
  // }

  constructor(
    private header_service: HeaderService,
    private good_service: GoodService
  ) {
    this.header_service.setTitle({
      title: "ТСД ВЖУХ"
    });

    this.good_service.list(1).then((goods: IListResponse<Good>)=>{
      console.log(goods);
    })
  }
}
