import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result } from '../services/calculate.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html'
})
export class ResultComponent implements OnInit {
  public result: Result = {
    brutoSalaris: 0,
    fiscaleWaarde: 0,
    leasebedrag: 0,
    loonLoonheffing: 0,
    loonheffing: 0,
    maandlasten: 0,
    nettoloon: 0,
    onkostenvergoeding: 0,
    ouderschapsverlof: 0,
    pensioen: 0,
    waardePriveGebruikAuto: 0,
    werknemerBijdrageAuto: 0,
    zorgverzekering: 0
  };

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.result = data.result);
  }

}
