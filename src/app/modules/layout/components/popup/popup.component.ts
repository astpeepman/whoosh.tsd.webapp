import {
  afterRender,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnInit,
  Output,
  Renderer2, RendererStyleFlags2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule, DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent{
  @ViewChild('popupModal', {static: false}) popupModal!: ElementRef;
  @ViewChild('popupHeader') popup_header!: ElementRef;
  @ViewChild('popupBody') popup_body!: ElementRef;

  @Input() title = '';
  @Input() body!: TemplateRef<any>;
  @Input() close_on_overlay: boolean = false;
  @Input() closer: boolean = true;

  @Output() display_event = new EventEmitter<boolean>();

  private display: boolean = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private readonly elRef:ElementRef
  ) {
  }




  public open(){
    this.renderer.addClass(this.elRef.nativeElement, "show-in");
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');

    const header_height = this.popup_header.nativeElement.clientHeight;
    this.renderer.setStyle(this.popup_body.nativeElement, 'height', `calc(100% - ${header_height + 24}px)`);

    if (!this.display)
      this.display_event.emit(true);

    this.display = true;
  }

  public close(){
    this.renderer.removeClass(this.elRef.nativeElement, "show-in");
    this.renderer.removeStyle(this.document.body, 'overflow');

    if (this.display)
      this.display_event.emit(false);

    this.display = false;
  }

  protected touchMoveMobilePopup($event: TouchEvent){
    if ($event.touches[0].clientY<=0 || $event.touches[0].clientY>=window.innerHeight)
      return;

    this.renderer.setStyle(this.popupModal.nativeElement, 'top', $event.touches[0].clientY + 'px', RendererStyleFlags2.Important);
  }

  protected touchEndMobilePopup($event: TouchEvent){
    let window_height = window.innerHeight;
    let popup_top = this.popupModal.nativeElement.getBoundingClientRect().top;

    if ((window_height - popup_top) < (window_height / 2))
      this.close();
    else
      this.open();

    this.renderer.removeStyle(this.popupModal.nativeElement, 'top');
  }

}
