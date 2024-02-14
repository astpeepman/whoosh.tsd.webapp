import {
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
export class PopupComponent implements OnInit{
  @ViewChild('popupModal', {static: false}) popupModal!: ElementRef;

  @Input() title = '';
  @Input() body!: TemplateRef<any>;
  @Input() close_on_overlay: boolean = false;
  @Input() closer: boolean = true;

  @Output() display_event = new EventEmitter<boolean>();

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private readonly elRef:ElementRef
  ) {
  }

  ngOnInit(): void {
  }


  public open(){
    this.renderer.addClass(this.elRef.nativeElement, "show-in");
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');

    this.display_event.emit(true);
  }

  public close(){
    this.renderer.removeClass(this.elRef.nativeElement, "show-in");
    this.renderer.removeStyle(this.document.body, 'overflow');

    this.display_event.emit(false);
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
