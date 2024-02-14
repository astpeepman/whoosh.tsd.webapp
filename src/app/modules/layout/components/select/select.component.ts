import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PopupComponent} from "../popup/popup.component";
import {NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

export interface SelectOption{
  label: string;
  value: any;
  hidden?: boolean
}

export interface SelectConfig{
  search?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    PopupComponent,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit{
  @Input('title') title: string = null;
  @Input('data') data!: SelectOption[];
  @Input('input') input!: HTMLInputElement;
  @Input('config') config: SelectConfig;

  @ViewChild('popup') popup: PopupComponent;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit() {
    this.input.onclick = ()=>{
      this.popup.open();
    }

    this.input.readOnly = true;
  }

  selectValue(value: any){
    this.select.emit(value);
    this.popup.close();
  }

  searchValue(text: string = null){
    this.data.forEach((option)=>{
      if (!text){
        option.hidden = false;
      }

      if (!option.label.includes(text)){
        option.hidden = true
      }
    })
  }

  get visible_options(){
    return this.data.filter((option)=>{
      return !option.hidden;
    })
  }
}
