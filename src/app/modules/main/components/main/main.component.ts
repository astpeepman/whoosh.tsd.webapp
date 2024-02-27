import {Component, ViewChild} from '@angular/core';
import {HeaderComponent} from "../../../layout/components/header/header.component";
import {HeaderService} from "../../../layout/services/header.service";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {ScannerComponent} from "../../../scanner/components/scanner/scanner.component";
import {PopupComponent} from "../../../layout/components/popup/popup.component";
import {ScannerQRCodeResult} from "ngx-scanner-qrcode";
import {DocumentService} from "../../services/document.service";
import {Router} from "@angular/router";

enum ScanType{
  INVENTORY,
  CONVERSION
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    LazyLoadImageModule,
    ScannerComponent,
    PopupComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @ViewChild('scanner') scanner!: ScannerComponent
  @ViewChild('popup') popup!: PopupComponent;


  private scan_type: ScanType;

  constructor(
    private header_service: HeaderService,
    private document_service: DocumentService,
    private router: Router
  ) {
    this.header_service.setTitle({
      title: "ТСД ВЖУХ"
    });
  }

  onScannerDisplay(display: boolean){
    if (!display)
      this.scanner.stop();
    else
      this.scanner.start();
  }

  startScanner(type:ScanType){
    this.scan_type = type;

    //ДЛЯ ТЕСТА
    // if (type === ScanType.CONVERSION){
    //   let barcode = "165519817318716399422362250662812434533";
    //   this.document_service.conversionFromBarcode(barcode).subscribe({
    //     next: (conversion_document)=>{
    //       this.router.navigate(['conversion', 'document'], {state: { document: conversion_document}});
    //     },
    //   })
    // }

    this.popup.open();
  }

  onScan(event: ScannerQRCodeResult[]){
    this.popup.close();

    let barcode = event[0].value;
    if (this.scan_type === ScanType.CONVERSION){
      this.document_service.conversionFromBarcode(barcode).subscribe({
        next: (conversion_document)=>{
          this.router.navigate(['conversion', 'document'], {state: { document: conversion_document}});
        },
      })
    }

  }

  protected readonly ScanType = ScanType;
}
