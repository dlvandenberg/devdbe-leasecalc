import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{

  public collapsed = true;

  constructor(private readonly dataService: DataService) {}

  public hasNoData(): boolean {
    const data = this.dataService.getData();
    return !data;
  }
}
