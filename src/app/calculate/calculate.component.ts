import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalculateService } from '../services/calculate.service';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent {

  constructor(private readonly calculateService: CalculateService) {}

  public calculate(form: NgForm): void {
    console.log(form.value);
    this.calculateService.calculate(form.value.fiscaleWaarde, form.value.leasebedrag);
  }
}
