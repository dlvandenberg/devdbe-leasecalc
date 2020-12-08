import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  private readonly firebareDbUrl = 'https://devdbe-leasecalc-default-rtdb.firebaseio.com/';
  private fiscaleWaarde: number;
  private leasebedrag: number;
  private loonLoonheffing: number;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly dataService: DataService
  ) { }

  public calculate(fiscaleWaarde: number, leasebedrag: number): void {
    this.fiscaleWaarde = fiscaleWaarde;
    this.leasebedrag = leasebedrag;
    const {
      brutoSalaris,
      bijtelling,
      zorgverzekering,
      pensioen,
      leasebudget,
      ouderschapsverlof,
      onkostenvergoeding
    } = this.dataService.getData();
    const waardePriveGebruikAuto = this.fiscaleWaarde * (bijtelling / 100) / 12;
    const werknemerBijdrageAuto = this.leasebedrag > leasebudget ? this.leasebedrag - leasebudget : 0;
    this.loonLoonheffing = brutoSalaris + zorgverzekering + waardePriveGebruikAuto - werknemerBijdrageAuto - pensioen - ouderschapsverlof;
    this.loonLoonheffing = this.loonLoonheffing - (this.loonLoonheffing % 4.5);
    this.getLoonheffing();
  }

  private getLoonheffing(): void {
    this.http.get(this.firebareDbUrl + this.loonLoonheffing + '.json')
      .subscribe(response => {
        if (!response) {
          console.log('Loonheffing bestaat nog niet -- invoeren');
          this.router.navigate(['loonheffing', this.loonLoonheffing]);
        }
      });
  }

  public loonheffing(loonheffing: number): void {
    console.log('loonheffing: ' + loonheffing);
  }
}
