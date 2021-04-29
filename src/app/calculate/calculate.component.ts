import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Data } from '../model/data.interface';
import { CalculateService } from '../services/calculate.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html'
})
export class CalculateComponent implements OnInit {
  private cookieData: Data;
  public budget: number;
  public savedBijtelling: number;
  public percentages = [22, 12];

  constructor(
    public readonly calculateService: CalculateService,
    private readonly dataService: DataService
  ) {}

  public calculate(form: NgForm): void {
    if (this.budget !== this.cookieData.leasebudget || this.savedBijtelling !== this.cookieData.bijtelling) {
      this.dataService.setData({ ...this.cookieData, leasebudget: this.budget, bijtelling: this.savedBijtelling });
    }

    this.calculateService.calculate(
      form.value.fiscaleWaarde,
      form.value.leasebedrag,
      form.value.leasebudget,
      form.value.bijtelling
    );
  }

  public ngOnInit(): void {
    this.cookieData = this.dataService.getData();
    if (this.cookieData) {
      this.budget = this.cookieData.leasebudget;
      this.savedBijtelling = this.cookieData.bijtelling;
    }
  }
}
