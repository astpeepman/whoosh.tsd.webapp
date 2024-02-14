import {Component, ElementRef, Renderer2} from '@angular/core';
import {ErrorService} from "../../../main/services/error.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  protected message: string = null;

  constructor(
    private error_service: ErrorService,
    private renderer: Renderer2,
    private readonly elRef:ElementRef
  ) {
    this.error_service.error$.subscribe((message: string)=>{
      this.message = message;
      this.renderer.addClass(this.elRef.nativeElement, 'show');
    })
  }

  close(){
    this.message = null;
    this.renderer.removeClass(this.elRef.nativeElement, 'show');
  }
}
