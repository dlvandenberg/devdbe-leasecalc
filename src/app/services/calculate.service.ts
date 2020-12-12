import { Injectable } from '@angular/core';
import { Data, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataService } from './data.service';
import { BehaviorSubject } from 'rxjs';

interface LoonheffingResponse {
  [key: string]: {
    loon: number;
    loonheffing: number;
  };
}

export interface Result {
  fiscaleWaarde: number;
  leasebedrag: number;
  brutoSalaris: number;
  zorgverzekering: number;
  waardePriveGebruikAuto: number;
  werknemerBijdrageAuto: number;
  pensioen: number;
  ouderschapsverlof: number;
  loonLoonheffing: number;
  loonheffing: number;
  onkostenvergoeding: number;
  nettoloon: number;
  maandlasten: number;
}

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  private readonly firebareDbUrl =
    'https://devdbe-leasecalc-default-rtdb.firebaseio.com/';
  private fiscaleWaarde: number;
  private leasebedrag: number;
  private loonLoonheffing: number;
  private currentYear = new Date().getFullYear();
  private data: Data;
  private waardePriveGebruikAuto: number;
  private werknemerBijdrageAuto: number;
  private nettoloon: number;
  private maandlasten: number;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private resultSubject = new BehaviorSubject<Result>({
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
    zorgverzekering: 0,
  });
  public result$ = this.resultSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly dataService: DataService
  ) {}

  public calculate(fiscaleWaarde: number, leasebedrag: number): void {
    this.loadingSubject.next(true);
    this.fiscaleWaarde = fiscaleWaarde;
    this.leasebedrag = leasebedrag;
    this.data = this.dataService.getData();
    const {
      brutoSalaris,
      bijtelling,
      zorgverzekering,
      pensioen,
      leasebudget,
      ouderschapsverlof,
    } = this.data;
    this.waardePriveGebruikAuto =
      (this.fiscaleWaarde * (bijtelling / 100)) / 12;
    this.werknemerBijdrageAuto =
      this.leasebedrag > leasebudget ? this.leasebedrag - leasebudget : 0;
    this.loonLoonheffing =
      brutoSalaris +
      zorgverzekering +
      this.waardePriveGebruikAuto -
      this.werknemerBijdrageAuto -
      pensioen -
      ouderschapsverlof;
    this.loonLoonheffing = this.loonLoonheffing - (this.loonLoonheffing % 4.5);
    this.getLoonheffing();
  }

  private getLoonheffing(): void {
    this.http
      .get<LoonheffingResponse>(
        this.firebareDbUrl + this.currentYear + '.json',
        {
          params: new HttpParams()
            .set('orderBy', '"loon"')
            .set('equalTo', '' + this.loonLoonheffing)
            .set('limitToFirst', '1'),
        }
      )
      .subscribe((response) => {
        if (!response) {
          console.log('Loonheffing bestaat nog niet -- invoeren');
          this.loadingSubject.next(false);
          this.router.navigate(['loonheffing', this.loonLoonheffing]);
        } else {
          console.log(response);
          const loonheffing = response[Object.keys(response)[0]].loonheffing;
          this.calculateNettoLoon(loonheffing);
        }
      });
  }

  public loonheffing(loon: number, loonheffing: number): void {
    console.log('loonheffing: ' + loonheffing);
    this.loadingSubject.next(true);
    this.http
      .post(this.firebareDbUrl + this.currentYear + '.json', {
        loon: +loon,
        loonheffing: +loonheffing,
      })
      .subscribe((_) => this.calculateNettoLoon(loonheffing));
  }

  private calculateNettoLoon(loonheffing: number): void {
    console.log('berekenen met loonheffing: ' + loonheffing);
    const {
      brutoSalaris,
      zorgverzekering,
      pensioen,
      ouderschapsverlof,
      onkostenvergoeding,
    } = this.data;
    this.nettoloon =
      brutoSalaris +
      zorgverzekering -
      pensioen -
      ouderschapsverlof -
      loonheffing -
      this.werknemerBijdrageAuto +
      onkostenvergoeding;
    this.maandlasten =
      (this.waardePriveGebruikAuto - this.werknemerBijdrageAuto) * 0.408 +
      this.werknemerBijdrageAuto;
    this.loadingSubject.next(false);
    this.resultSubject.next({
      brutoSalaris,
      fiscaleWaarde: this.fiscaleWaarde,
      leasebedrag: this.leasebedrag,
      loonLoonheffing: this.loonLoonheffing,
      loonheffing,
      maandlasten: this.maandlasten,
      nettoloon: this.nettoloon,
      onkostenvergoeding,
      ouderschapsverlof,
      pensioen,
      waardePriveGebruikAuto: this.waardePriveGebruikAuto,
      werknemerBijdrageAuto: this.werknemerBijdrageAuto,
      zorgverzekering,
    });
    this.router.navigate(['result']);
  }
}
