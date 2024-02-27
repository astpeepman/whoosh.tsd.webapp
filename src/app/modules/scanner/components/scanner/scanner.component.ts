import {
  afterNextRender,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject, Input, Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeModule,
  ScannerQRCodeConfig, ScannerQRCodeDevice,
  ScannerQRCodeResult
} from "ngx-scanner-qrcode";
import {LoaderComponent} from "../../../layout/components/loader/loader.component";
import {AsyncPipe, isPlatformBrowser, NgClass, NgIf, NgStyle} from "@angular/common";
import {LazyLoadImageModule} from "ng-lazyload-image";


export interface IScannerConfig{
  stop_on_scan: boolean;
}

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [
    NgxScannerQrcodeModule,
    LoaderComponent,
    NgIf,
    AsyncPipe,
    LazyLoadImageModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss'
})
export class ScannerComponent {
  @Input('config') cfg: IScannerConfig = {
    stop_on_scan: true
  };

  @ViewChild('action') action!: NgxScannerQrcodeComponent;
  @ViewChild('scannerContainer') scanner_container!: ElementRef;

  @Output() scanned = new EventEmitter<ScannerQRCodeResult[]>();

  protected devices: ScannerQRCodeDevice[] = null;
  protected torcher: boolean = false;

  protected is_browser:boolean;

  public config: ScannerQRCodeConfig = {
    fps: 30,
    vibrate: 300,
    constraints: {
      video:{
        // aspectRatio: 12/5,
        // height: 1024,
        // width: 1024,
      }
    },
    canvasStyles: [
      { /* layer */
        lineWidth: 5,
        fillStyle: 'rgba(255,255,255,0.51)',
        strokeStyle: 'rgb(255,0,0)',
      },
      {}
    ],
  };

  constructor(
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    if (isPlatformBrowser(platform)){
      this.is_browser = true;
    }
    afterNextRender(()=>{
      this.action.devices.subscribe((devices)=>{
        this.devices = devices;
      })
    });
    // afterNextRender(()=>{
    //   this.action.isReady.subscribe((res: any)=>{
    //     this.start();
    //   });
    // })
  }

  public start(index: number = null){
    const aspectRatio = this.scanner_container.nativeElement.offsetHeight / this.scanner_container.nativeElement.offsetWidth;
    // @ts-ignore
    this.config.constraints.video['height'] = 500;
    // @ts-ignore
    this.config.constraints.video['width'] = 500 * aspectRatio;

    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      if (index === null || index > this.devices.length - 1){
        const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
        index = device ? devices.indexOf(device) : 0;
      }

      this.action.playDevice(devices[index].deviceId).subscribe({
        next: (res)=>{
          this.action.isStart = true;
          this.action.torcher().subscribe({
            next: (r)=>{
              this.torcher = r;
            },
            error: (err)=>{
              this.torcher = false;
            }
          })
        }
      });
    }

    this.action.start(playDeviceFacingBack).subscribe({
      next: (r)=>{
        console.log('start', r);
      },
      error: (err)=> {
        console.error(err);
      }
    });
  }

  protected torch(){
    this.action.isTorch = !this.action.isTorch;
    this.action.torcher();
  }

  protected switch(){
    let index = this.action.deviceIndexActive + 1;

    if (index == this.devices.length)
      index = 0;

    this.action.playDevice(this.devices[index].deviceId).subscribe({
      next: (res)=>{
        this.action.isStart = true;
        this.action.torcher().subscribe({
          next: (r)=>{
            this.torcher = r;
          },
          error: (err)=>{
            this.torcher = false;
          }
        })
      }
    });
  }

  public stop(){
    this.action.stop();
  }

  protected onScan(e: ScannerQRCodeResult[]){
    if (this.cfg.stop_on_scan){
      this.stop();
    }
    this.scanned.emit(e);
  }
}
