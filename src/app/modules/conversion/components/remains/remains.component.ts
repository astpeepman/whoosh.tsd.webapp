import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Server} from "../../../main/models/server";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-remains',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './remains.component.html',
  styleUrl: './remains.component.scss'
})
export class RemainsComponent{
  protected remain_list: Server.Remain<Server.Good>[];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    const document: Server.DocumentConversion = history.state.document;

    if (!document){
      this.router.navigate(['/']);
      return;
    }

    this.remain_list = document.response_cell.remain_list;
  }
}
