import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CalculateService } from '../services/calculate.service';

@Component({
  selector: 'app-loonheffing',
  templateUrl: './loonheffing.component.html',
  styleUrls: ['./loonheffing.component.scss']
})
export class LoonheffingComponent implements OnInit {

  public loonLoonheffing = 0;

  constructor(
    private readonly calculateService: CalculateService,
    private readonly route: ActivatedRoute
  ) {}


  public ngOnInit(): void {
    this.route.params.subscribe(param => this.loonLoonheffing = param.loon);
  }

  public loonheffing(form: NgForm): void {
    this.calculateService.loonheffing(form.value.loonheffing);
  }
}
