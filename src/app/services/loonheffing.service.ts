import { Injectable } from '@angular/core';

const L_MAX = 98820;

interface Schijfwaarden {
  schijf1Max: number;
  schijf2Max: number;
  schijf3Max: number;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  c1: number;
  c2: number;
  c3: number;
  c4: number;
}

const JONGER_DAN_AOW_SCHIJFWAARDEN: Schijfwaarden = {
  schijf1Max: 20711,
  schijf2Max: 34712,
  schijf3Max: 68507,
  a1: 0,
  a2: 20711,
  a3: 34712,
  a4: 68507,
  b1: 37.35,
  b2: 37.35,
  b3: 37.35,
  b4: 49.5,
  c1: 0,
  c2: 7735,
  c3: 12964,
  c4: 25586,
};

interface Heffingskortingwaarden {
  ahk1: number;
  ahk2: number;
  ouk1: number;
  ouk2: number;
  ouk3: number;
  aok1: number;
  arko1: number;
  arko2: number;
  arko3: number;
  arkg1: number;
  arkg2: number;
  arkg3: number;
  arkm1: number;
  arkm2: number;
  arkm3: number;
  arka1: number;
  arkg4: number;
}

const JONGER_DAN_AOW_HEFFINGSKORTING: Heffingskortingwaarden = {
  ahk1: 2711,
  ahk2: 0.05672,
  ouk1: 0,
  ouk2: 0,
  ouk3: 0,
  aok1: 0,
  arko1: 0.02812,
  arko2: 0.28812,
  arko3: 0.01656,
  arkg1: 9921,
  arkg2: 21430,
  arkg3: 34954,
  arkm1: 279,
  arkm2: 3595,
  arkm3: 3819,
  arka1: 0.06,
  arkg4: 98604,
};

interface Symboolwaarden {
  a: number;
  b: number;
  c: number;
}

const MAANDELIJKS = 12;

@Injectable({
  providedIn: 'root',
})
export class LoonheffingService {
  private jaarloon: number;
  private readonly schijfwaarden: Schijfwaarden;
  private readonly heffingskortingwaarden: Heffingskortingwaarden;

  constructor() {
    this.schijfwaarden = JONGER_DAN_AOW_SCHIJFWAARDEN;
    this.heffingskortingwaarden = JONGER_DAN_AOW_HEFFINGSKORTING;
  }

  /**
   * Bereken loonheffing voor het opgegeven maandloon.
   * Formule: x = X/F;
   *
   * Resultaat: afronden op 2 decimalen
   * @param maandloon maandloon
   */
  public calculateLoonheffing(maandloon: number): number {
    this.jaarloon = maandloon * MAANDELIJKS;
    console.log('L: ' + this.jaarloon);
    const jaarlijkseInhouding = this.berekenInhouding();
    console.log('X: ' + jaarlijkseInhouding);
    return this.rondAfOpDecimalen(jaarlijkseInhouding / MAANDELIJKS, 2);
  }

  /**
   * Formule: X = X1 - (heffingskortingen);
   *
   * Condities:
   *   X1 >= (heffingskortingen)
   *   Anders: TODO
   *
   * Resultaat: afronden X naar beneden op hele euro's
   * X >= 0;
   */
  private berekenInhouding(): number {
    const loonbelasting = this.berekenLoonbelasting();
    console.log('X1: ' + loonbelasting);
    const heffingskortingen = this.berekenHeffingskortingen();
    console.log('(AHK + OUK + AOK + AOK): ' + heffingskortingen);
    const result = Math.floor(loonbelasting - heffingskortingen);
    console.log('X: ' + result);
    return Math.max(result, 0);
  }

  /**
   * Formule:
   * Als L <= Lmax:
   *   ((L - a) * b / 100 + c)
   *
   * Als L > Lmax:
   *  TODO NOT SUPPORTED
   *
   * Resultaat: afronden naar beneden op hele euro's
   */
  private berekenLoonbelasting(): number {
    if (this.jaarloon > L_MAX) {
      throw Error(
        'Kan nog geen loonbelasting berekenen voor loon hoger dan het maximale jaarloon (€ 98.820,-)'
      );
    }
    const { a, b, c } = this.bepaalSymboolwaarden();
    const loonbelasting = ((this.jaarloon - a) * b) / 100 + c;
    return Math.floor(loonbelasting);
  }

  private bepaalSymboolwaarden(): Symboolwaarden {
    let symboolwaarden: Symboolwaarden;
    if (this.jaarloon <= this.schijfwaarden.schijf1Max) {
      symboolwaarden = {
        a: this.schijfwaarden.a1,
        b: this.schijfwaarden.b1,
        c: this.schijfwaarden.c1,
      };
    } else if (
      this.jaarloon > this.schijfwaarden.schijf1Max &&
      this.jaarloon <= this.schijfwaarden.schijf2Max
    ) {
      symboolwaarden = {
        a: this.schijfwaarden.a2,
        b: this.schijfwaarden.b2,
        c: this.schijfwaarden.c2,
      };
    } else if (
      this.jaarloon > this.schijfwaarden.schijf2Max &&
      this.jaarloon <= this.schijfwaarden.schijf3Max
    ) {
      symboolwaarden = {
        a: this.schijfwaarden.a3,
        b: this.schijfwaarden.b3,
        c: this.schijfwaarden.c3,
      };
    } else {
      symboolwaarden = {
        a: this.schijfwaarden.a4,
        b: this.schijfwaarden.b4,
        c: this.schijfwaarden.c4,
      };
    }
    return symboolwaarden;
  }

  /**
   * Formule: AHK + OUK + AOK + ARK
   */
  private berekenHeffingskortingen(): number {
    const ahk = this.berekenAlgemeneHeffingskorting();
    console.log('ahk: ' + ahk);
    const ouk = this.berekenOuderenkorting();
    console.log('ouk: ' + ouk);
    const aok = this.berekenAlleenstaandeOuderenkorting();
    console.log('aok: ' + aok);
    const ark = this.berekenArbeidskorting();
    console.log('ark: ' + ark);
    return ahk + ouk + aok + ark;
  }

  /**
   * Formule:
   * Als L <= a4
   *   AHK = ahk1 - (L - a2) * ahk2
   * Als L > a4
   *   AHK = 0
   */
  private berekenAlgemeneHeffingskorting(): number {
    let ahk: number;
    const { a4, a2 } = this.schijfwaarden;
    const { ahk1, ahk2 } = this.heffingskortingwaarden;
    if (this.jaarloon <= a4) {
      ahk = ahk1;
      if (this.jaarloon >= a2) {
        ahk = ahk - (this.jaarloon - a2) * ahk2;
      }
    } else {
      ahk = 0;
    }
    return ahk;
  }

  /**
   * Formule: OUK = ouk1 - (L - ouk2) * ouk3
   * Resultaat: OUX >= 0;
   */
  private berekenOuderenkorting(): number {
    const ouk =
      this.heffingskortingwaarden.ouk1 -
      Math.max(this.jaarloon - this.heffingskortingwaarden.ouk2, 0) *
        this.heffingskortingwaarden.ouk3;
    return Math.max(ouk, 0);
  }

  /**
   * Formule: AOK = aok1;
   */
  private berekenAlleenstaandeOuderenkorting(): number {
    return this.heffingskortingwaarden.aok1;
  }

  /**
   * Formule:
   * ARK = arko1 * L + arko2 * (L - arkg1) + arko3 * (L - arkg2) - arka1 * (L - arkg3)
   *
   * Condities:
   *   (L - arkg1) >= 0;
   *   (L - arkg2) >= 0;
   *   (L - arkg3) >= 0;
   *   Max(arko1 * L, arkm1);
   *   Max(arko1 * L + arko2 * (L - arkg1), arkm2);
   *   Max(arko1 * L + arko2 * (L - arkg1) + arko3 * (L - arkg2), arkm3);
   *   L >= arkg4 ? dan ARK = 0;
   *
   * Resultaat:
   *   arko1 * L,
   *   arko2 * (L - arkg1),
   *   arko3 * (L - arkg2),
   *   arka1 * (L - argk3)
   *   -> afronden op 5 decimalen
   *
   *   ARK naar boven afronden op hele euro's
   */
  private berekenArbeidskorting(): number {
    const { arka1, arkg3, arkg4, arkg1, arkg2 } = this.heffingskortingwaarden;
    let ark: number;
    if (this.jaarloon >= arkg4) {
      ark = 0;
    } else {
      const ark1 = this.berekenArk1();
      console.log('ark1: ' + ark1);
      if (this.jaarloon < arkg1) {
        console.log('return ');
        return Math.ceil(ark1);
      }
      const ark2 = this.berekenArk2(ark1);
      console.log('ark2: ' + ark2);
      if (this.jaarloon < arkg2) {
        return Math.ceil(ark2);
      }
      const ark3 = this.berekenArk3(ark2);
      console.log('ark3: ' + ark3);
      if (this.jaarloon < arkg3) {
        return Math.ceil(ark3);
      }
      let arka = arka1 * Math.max(this.jaarloon - arkg3, 0);
      arka = this.rondAfOpDecimalen(arka, 5);
      console.log('arka: ' + arka);
      ark = ark3 - arka;
    }
    return Math.ceil(ark);
  }

  private berekenArk1(): number {
    const { arko1, arkm1 } = this.heffingskortingwaarden;
    let ark1 = arko1 * this.jaarloon;
    ark1 = this.rondAfOpDecimalen(ark1, 5);
    return Math.min(ark1, arkm1);
  }

  private berekenArk2(ark1: number): number {
    const { arko2, arkg1, arkm2 } = this.heffingskortingwaarden;
    let ark2 = arko2 * Math.max(this.jaarloon - arkg1, 0);
    ark2 = this.rondAfOpDecimalen(ark2, 5);
    return Math.min(ark1 + ark2, arkm2);
  }

  private berekenArk3(ark2: number): number {
    const { arko3, arkg2, arkm3 } = this.heffingskortingwaarden;
    let ark3 = arko3 * Math.max(this.jaarloon - arkg2, 0);
    ark3 = this.rondAfOpDecimalen(ark3, 5);
    return Math.min(ark2 + ark3, arkm3);
  }

  public rondAfOpDecimalen(bedrag: number, decimalen: number): number {
    let decimals = '1';
    while (decimalen > 0) {
      decimals += '0';
      decimalen--;
    }
    return Math.round(bedrag * +decimals) / +decimals;
  }
}
