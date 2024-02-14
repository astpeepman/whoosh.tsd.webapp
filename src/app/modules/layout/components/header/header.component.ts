import {Component, OnInit} from '@angular/core';
import {IUser} from "../../../user/models/user";
import {UserService} from "../../../user/services/user.service";
import {PopupComponent} from "../popup/popup.component";
import {RouterLink} from "@angular/router";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {IHeaderTitle} from "../../models/header";
import {HeaderService} from "../../services/header.service";
import {LazyLoadImageModule} from "ng-lazyload-image";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    PopupComponent,
    RouterLink,
    NgTemplateOutlet,
    NgIf,
    LazyLoadImageModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  protected user: IUser;
  protected header_title: IHeaderTitle;

  constructor(
    private user_service: UserService,
    private header_service: HeaderService
  ) {

  }

  ngOnInit() {
    this.user_service.user$.subscribe((user: IUser)=>{
      this.user = user;
    });

    this.header_service.title$.subscribe((title: IHeaderTitle)=>{
      this.header_title = title;
    });
  }
}
