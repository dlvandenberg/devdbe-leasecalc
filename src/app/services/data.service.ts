import { Injectable } from '@angular/core';
import { Data } from '../model/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public getData(): Data {
    return JSON.parse(localStorage.getItem('leasedata'));
  }

  public setData(data: Data): void {
    localStorage.setItem('leasedata', JSON.stringify(data));
  }
}
