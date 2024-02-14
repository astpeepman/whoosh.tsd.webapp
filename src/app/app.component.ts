import {
  afterNextRender,
  afterRender,
  AfterViewInit,
  Component, ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID, Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {BehaviorSubject, filter, fromEvent, map, merge, Observable, of, Subscription} from "rxjs";
import { Platform } from '@angular/cdk/platform';
import {PopupComponent} from "./modules/layout/components/popup/popup.component";
import {HeaderComponent} from "./modules/layout/components/header/header.component";
import {UserService} from "./modules/user/services/user.service";
import {LoaderComponent} from "./modules/layout/components/loader/loader.component";
import {ErrorComponent} from "./modules/layout/components/error/error.component";
import {Good} from "./modules/main/models/good";
import {Server} from "./modules/main/models/server";
import {GoodTable} from "../database/tables/good";
import {CellTable} from "../database/tables/cell";
import {AppDatabase, DataBase} from "../database/database";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PopupComponent,
    HeaderComponent,
    LoaderComponent,
    ErrorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'tsd app';

  network_status_online: boolean = true;
  network_status_online$: Subscription = Subscription.EMPTY;

  modal_pwa_event: any;
  private modal_pwa_platform_subject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public modal_pwa_platform$: Observable<string> = this.modal_pwa_platform_subject.asObservable();

  @ViewChild('addToHomeScreenPopup') add_to_home_screen_popup: PopupComponent;
  @ViewChild('loader') loader: LoaderComponent;

  constructor(
    private sw_update: SwUpdate,
    @Inject(PLATFORM_ID) private platform: string,
    private modal_platform: Platform,
    private user_service: UserService,
    private db: DataBase
  ) {
    afterNextRender(()=>{
      this.modal_pwa_platform$.subscribe((modal_pwa_platform: string)=>{
        if (modal_pwa_platform)
          this.add_to_home_screen_popup.open();
      });

      this.loader.hide();
    });

    if (user_service.is_auth)
      this.user_service.get().subscribe();
  }

  ngOnInit(): void {
    if (!this.sw_update.isEnabled)
      return;

    this.sw_update.versionUpdates.pipe(
      filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map((evt: any) => {
        console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
        window.location.reload();
      }),
    ).subscribe();

    this.loadModalPwa();
    this.checkNetworkStatus();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platform))
      this.network_status_online$.unsubscribe();
  }

  private checkNetworkStatus() {
    this.network_status_online = navigator.onLine;
    this.network_status_online$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        console.log('network status', status);
        this.network_status_online = status;
      });
  }

  private loadModalPwa(): void {
    if (!(this.modal_platform.ANDROID || (this.modal_platform.IOS && this.modal_platform.SAFARI))){
      return;
    }

    if (this.modal_platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modal_pwa_event = event;
        this.modal_pwa_platform_subject.next('ANDROID');
      });
    }

    if (this.modal_platform.IOS && this.modal_platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modal_pwa_platform_subject.next('IOS');
      }
    }
  }

  public addToHomeScreen(): void {
    this.modal_pwa_event.prompt();
    this.modal_pwa_platform_subject.next(null);
    this.add_to_home_screen_popup.close();
  }

  public closePwa(): void {
    this.modal_pwa_platform_subject.next(null);
  }
}
