import {Component, TemplateRef, ViewChild} from '@angular/core';
import {GoodService} from "../../../main/services/good.service";
import {Good} from "../../../main/models/good";
import {IListResponse} from "../../../main/models/response";
import {SelectOption} from "../../../layout/components/select/select.component";
import {Server} from "../../../main/models/server";
import {Subject} from "rxjs";

@Component({
  selector: 'app-good.list',
  templateUrl: './good.list.component.html',
  styleUrl: './good.list.component.scss'
})
export class GoodListComponent {
  protected good_list: Good[];
  protected good_select_list: SelectOption[] = [];

  protected my_remain_list: Server.Remain<Server.Good>[] = [];

  @ViewChild('goodSelectOption') good_select_option_template: TemplateRef<any>;

  protected list_params: {
    next: boolean,
    page: number
  };

  protected searching = new Subject<boolean>();

  constructor(
    private good_service: GoodService
  ) {
    this.good_service.list().then((list_response: IListResponse<Good>)=>{
      this.good_list = list_response.results;
      this.list_params = {
        next: list_response.next,
        page: list_response.page
      }

      this.good_list.forEach((good: Good)=>{
        this.good_select_list.push({
          label: good.name,
          value: good
        });
      });

    });
  }

  protected async goodSearch(text: string){
    let result: SelectOption[] = [];

    console.log(text)

    if (!text){
      let data = await this.good_service.list();
      data.results.forEach((good: Good)=>{
        result.push({
          label: good.name,
          value: good
        });
      });

      return result;
    }

    let search_result = await this.good_service.search(text);

    console.log(search_result);
    if (!search_result){
      return result;
    }

    search_result.results.forEach((good)=>{
      result.push({
        value: good,
        label: good.name
      })
    });

    return result;
  }

  selectGood(good: Good){
    // this.my_remain_list.push({
    //   object: {
    //     name: good.name,
    //     barcode: good.barcode,
    //     unit: good.unit,
    //     vendor_code: good.vendor_code,
    //     master_code: good.master_code,
    //     property: good.property,
    //     models: good.models,
    //     remainder: good.remainder,
    //     id: good.id
    //   },
    //   quantity: 1
    // })
    // console.log(good);
    // this.my_remain_list.indexOf()
    // const index = this.my_remain_list.indexOf(good);
    // if (index > -1){
    //   this.my_list.slice(index, 1);
    // }
    // else{
    //   this.my_list.push(good);
    // }
  }
}
