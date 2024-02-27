import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HeaderService} from "../../../layout/services/header.service";
import {Server} from "../../../main/models/server";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent{
  protected document: Server.DocumentConversion;

  constructor(
    private router: Router,
    private header_service: HeaderService
  ) {

    this.document = history.state.document;

    if (!this.document){
      this.router.navigate(['/']);
      return;
    }

    this.header_service.setTitle({
      title: this.document.response_cell.object.name
    });
  }
}
