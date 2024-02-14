import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit, AfterViewInit{
  @Input('show') is_show: boolean = true;

  private show_subject = new BehaviorSubject<boolean>(null);
  private show$ = this.show_subject.asObservable();

  constructor(
    private renderer: Renderer2,
    private readonly elRef:ElementRef
  ) {
  }

  ngOnInit() {
    this.show_subject.next(this.is_show);
  }

  ngAfterViewInit() {
    this.show$.subscribe((showed)=>{
      if (showed){
        this.renderer.addClass(this.elRef.nativeElement, 'show');
      }
      else{
        this.renderer.removeClass(this.elRef.nativeElement, 'show');
      }
    });
  }

  hide(){
    this.show_subject.next(false);
  }

  show(){
    this.show_subject.next(true);
  }
}
