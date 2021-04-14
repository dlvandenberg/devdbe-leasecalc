export interface Data {
    brutoSalaris: number;
    nettoSalaris: number;
    leasebudget: number;
    belasteVergoedingen: { naam: string, bedrag: number }[];
    belasteInhoudingen: { naam: string, bedrag: number }[];
    onbelasteVergoedingen: { naam: string, bedrag: number }[];
    onbelasteInhoudingen: { naam: string, bedrag: number }[];
}
