import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject } from 'rxjs';
import { LoonheffingService } from './loonheffing.service';
import { Data } from '../model/data.interface';
import { Router } from '@angular/router';

export interface Result {
  fiscaleWaarde: number;
  bijtelling: number;
  leasebedrag: number;
  leasebudget: number;
  brutoSalaris: number;
  waardePriveGebruikAuto: number;
  werknemerBijdrageAuto: number;
  loonLoonheffing: number;
  loonheffing: number;
  nettoloon: number;
  verschilNettoloon: number;
  maandlasten: number;
  belasteVergoedingen: { naam: string, bedrag: number }[];
  belasteInhoudingen: { naam: string, bedrag: number }[];
  onbelasteVergoedingen: { naam: string, bedrag: number }[];
  onbelasteInhoudingen: { naam: string, bedrag: number }[];
}

const BIJTELLING_REGELS: { [key: number]: { cap: number, bijtellingRest: number} } = {
  12: {
    cap: 40000,
    bijtellingRest: 22
  }, 
  22: {
    cap: undefined,
    bijtellingRest: undefined
  }
}

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  private fiscaleWaarde: number;
  private bijtelling: number;
  private leasebedrag: number;
  private leasebudget: number;
  private loonLoonheffing: number;
  private data: Data;
  private waardePriveGebruikAuto: number;
  private werknemerBijdrageAuto: number;
  private nettoloon: number;
  private verschilNettoloon: number;
  private maandlasten: number;
  private totaleBelasteInhoudingen: number;
  private totaleBelasteVergoedingen: number;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private resultSubject = new BehaviorSubject<Result>({
    brutoSalaris: 0,
    fiscaleWaarde: 0,
    bijtelling: 0,
    leasebudget: 0,
    leasebedrag: 0,
    loonLoonheffing: 0,
    loonheffing: 0,
    maandlasten: 0,
    nettoloon: 0,
    verschilNettoloon: 0,
    waardePriveGebruikAuto: 0,
    werknemerBijdrageAuto: 0,
    belasteVergoedingen: [],
    belasteInhoudingen: [],
    onbelasteVergoedingen: [],
    onbelasteInhoudingen: []
  });
  public result$ = this.resultSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly loonheffingService: LoonheffingService
  ) {}

  public calculate(fiscaleWaarde: number, leasebedrag: number, leasebudget: number, bijtelling: number): void {
    this.loadingSubject.next(true);
    this.fiscaleWaarde = fiscaleWaarde;
    this.bijtelling = bijtelling;
    this.leasebedrag = leasebedrag;
    this.leasebudget = leasebudget;
    this.data = this.dataService.getData();
    const {
      brutoSalaris,
      belasteVergoedingen,
      belasteInhoudingen
    } = this.data;
    this.waardePriveGebruikAuto = this.berekenWaardePriveGebruikAuto(fiscaleWaarde, bijtelling);
    this.werknemerBijdrageAuto =
      this.leasebedrag > leasebudget ? this.leasebedrag - leasebudget : 0;
    this.totaleBelasteVergoedingen = belasteVergoedingen.map(belasteVergoeding => belasteVergoeding.bedrag)
      .reduce((som, vergoeding) => som + vergoeding, 0);
    this.totaleBelasteInhoudingen = belasteInhoudingen.map(belasteInhouding => belasteInhouding.bedrag)
      .reduce((som, inhouding) => som + inhouding, 0);
    this.loonLoonheffing =
      brutoSalaris +
      this.totaleBelasteVergoedingen +
      this.waardePriveGebruikAuto -
      this.werknemerBijdrageAuto -
      this.totaleBelasteInhoudingen;
    this.loonLoonheffing = this.loonLoonheffing - (this.loonLoonheffing % 4.5);
    this.getLoonheffing();
  }

  private berekenWaardePriveGebruikAuto(fiscaleWaarde: number, bijtelling: number): number {
    const regels = BIJTELLING_REGELS[bijtelling];
    if (regels.cap === undefined || fiscaleWaarde < regels.cap) {
      return (fiscaleWaarde * (bijtelling / 100)) / 12
    } else if (fiscaleWaarde >= regels.cap) {
      return (regels.cap * (bijtelling / 100) + (fiscaleWaarde - regels.cap) * (regels.bijtellingRest / 100)) / 12;
    }
  }

  private getLoonheffing(): void {
    const loonheffing = this.loonheffingService.calculateLoonheffing(this.loonLoonheffing);
    this.calculateNettoLoon(loonheffing);
  }

  private calculateNettoLoon(loonheffing: number): void {
    const {
      brutoSalaris,
      nettoSalaris,
      belasteVergoedingen,
      belasteInhoudingen,
      onbelasteVergoedingen,
      onbelasteInhoudingen
    } = this.data;
    const totaleOnbelasteInhoudingen = onbelasteInhoudingen.map(onbelasteInhouding => onbelasteInhouding.bedrag)
      .reduce((som, inhouding) => som + inhouding, 0);
    const totaleOnbelasteVergoedingen = onbelasteVergoedingen.map(onbelasteVergoeding => onbelasteVergoeding.bedrag)
      .reduce((som, vergoeding) => som + vergoeding, 0);
    this.nettoloon = brutoSalaris + this.totaleBelasteVergoedingen
      - loonheffing - this.totaleBelasteInhoudingen
      - this.werknemerBijdrageAuto
      - totaleOnbelasteInhoudingen
      + totaleOnbelasteVergoedingen;

    this.maandlasten = this.berekenMaandlasten();
    this.verschilNettoloon = this.berekenVerschilNettoloon(nettoSalaris, this.nettoloon);
    this.loadingSubject.next(false);
    this.resultSubject.next({
      brutoSalaris,
      fiscaleWaarde: this.fiscaleWaarde,
      bijtelling: this.bijtelling,
      leasebedrag: this.leasebedrag,
      leasebudget: this.leasebudget,
      loonLoonheffing: this.loonLoonheffing,
      loonheffing,
      maandlasten: this.maandlasten,
      nettoloon: this.nettoloon,
      verschilNettoloon: this.verschilNettoloon,
      belasteInhoudingen,
      belasteVergoedingen,
      onbelasteInhoudingen,
      onbelasteVergoedingen,
      waardePriveGebruikAuto: this.waardePriveGebruikAuto,
      werknemerBijdrageAuto: this.werknemerBijdrageAuto,
    });
    this.loadingSubject.next(false);
    this.router.navigate(['result']);
  }

  private berekenMaandlasten(): number {
    return (this.waardePriveGebruikAuto - this.werknemerBijdrageAuto) * 0.371 + this.werknemerBijdrageAuto;
  }

  private berekenVerschilNettoloon(huidigSalaris: number, nieuwSalaris: number): number {
    return nieuwSalaris - huidigSalaris;
  }
}
