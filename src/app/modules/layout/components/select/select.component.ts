import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {PopupComponent} from "../popup/popup.component";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

export interface SelectOption{
  label: string;
  value: any;
  hidden?: boolean,
  template?: TemplateRef<any>
}

export interface SelectConfig{
  search?: boolean | ((text: string) => SelectOption[] | Promise<SelectOption[]>);
  template?: TemplateRef<any>
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    PopupComponent,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgTemplateOutlet
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit{
  @Input('title') title: string = null;
  @Input('data') data!: SelectOption[];
  @Input('input') input!: HTMLInputElement | HTMLButtonElement;
  @Input('config') config: SelectConfig;

  @ViewChild('popup') popup: PopupComponent;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit() {
    this.input.onclick = ()=>{
      this.popup.open();
    }

    if (this.input instanceof HTMLInputElement)
      this.input.readOnly = true;
  }

  selectValue(value: any){
    this.select.emit(value);
    this.popup.close();
  }

  searchValue(text: string = null){
    if (typeof this.config.search === 'boolean')
      this.data.forEach((option)=>{
        if (!text){
          option.hidden = false;
        }

        if (!option.label.includes(text)){
          option.hidden = true
        }
      })
    else if (typeof this.config.search === 'function'){
      const func_result = this.config.search(text);
      if (func_result instanceof Array) {
        this.data = func_result;
      }

      if (func_result instanceof Promise){
        func_result.then((options: SelectOption[])=>{
          this.data = options;
        })
      }
    }
  }

  get visible_options(){
    if (this.data)
      return this.data.filter((option)=>{
        return !option.hidden;
      })

    return this.data;
  }
}
