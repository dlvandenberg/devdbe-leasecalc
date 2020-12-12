import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
  <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  `,
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent  {

}
