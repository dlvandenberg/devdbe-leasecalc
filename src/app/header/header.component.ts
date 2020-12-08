import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  public collapsed = true;

  public hasNoData(): boolean {
    const data = localStorage.getItem('leasedata');
    return !data;
  }
}
