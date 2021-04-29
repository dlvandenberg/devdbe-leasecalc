import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data } from '../model/data.interface';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html'
})
export class DataComponent implements OnInit {
  public dataForm: FormGroup;
  public data: Data = {
    brutoSalaris: null,
    nettoSalaris: null,
    leasebudget: null,
    bijtelling: null,
    belasteVergoedingen: [],
    belasteInhoudingen: [],
    onbelasteVergoedingen: [],
    onbelasteInhoudingen: []
  };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly dataService: DataService
  ) {}

  ngOnInit(): void {
    const parsedData = this.dataService.getData();
    if (parsedData != null) {
      this.data = parsedData;
    }

    const belasteVergoedingen = new FormArray([]);
    for (const belasteVergoeding of this.data.belasteVergoedingen) {
      belasteVergoedingen.push(this.maakNaamBedragFormGroup(belasteVergoeding.naam, belasteVergoeding.bedrag));
    }

    const belasteInhoudingen = new FormArray([]);
    for (const belasteInhouding of this.data.belasteInhoudingen) {
      belasteInhoudingen.push(this.maakNaamBedragFormGroup(belasteInhouding.naam, belasteInhouding.bedrag));
    }

    const onbelasteVergoedingen = new FormArray([]);
    for (const onbelasteVergoeding of this.data.onbelasteVergoedingen) {
      onbelasteVergoedingen.push(this.maakNaamBedragFormGroup(onbelasteVergoeding.naam, onbelasteVergoeding.bedrag));
    }

    const onbelasteInhoudingen = new FormArray([]);
    for (const onbelasteInhouding of this.data.onbelasteInhoudingen) {
      onbelasteInhoudingen.push(this.maakNaamBedragFormGroup(onbelasteInhouding.naam, onbelasteInhouding.bedrag));
    }

    this.dataForm = this.formBuilder.group({
      brutoSalaris: this.formBuilder.control(this.data.brutoSalaris, [
        Validators.required,
        Validators.min(0),
      ]),
      nettoSalaris: this.formBuilder.control(this.data.nettoSalaris, [
        Validators.required,
        Validators.min(0),
      ]),
      leasebudget: this.formBuilder.control(this.data.leasebudget, [
        Validators.required,
        Validators.min(0),
      ]),
      belasteVergoedingen,
      belasteInhoudingen,
      onbelasteVergoedingen,
      onbelasteInhoudingen
    });
  }

  public saveData(): void {
    this.dataService.setData(this.dataForm.value);
    this.router.navigate(['bereken']);
  }


  get brutoSalarisInvalid(): boolean {
    return (
      this.dataForm.controls.brutoSalaris.dirty &&
      this.dataForm.controls.brutoSalaris.invalid
    );
  }

  get nettoSalarisInvalid(): boolean {
    return (
      this.dataForm.controls.nettoSalaris.dirty &&
      this.dataForm.controls.nettoSalaris.invalid
    );
  }

  get leasebudgetInvalid(): boolean {
    return (
      this.dataForm.controls.leasebudget.dirty &&
      this.dataForm.controls.leasebudget.invalid
    );
  }

  private maakNaamBedragFormGroup(naam?: string, bedrag?: number): FormGroup {
    return this.formBuilder.group({
      naam: this.formBuilder.control(naam, Validators.required),
      bedrag: this.formBuilder.control(bedrag, [ Validators.required, Validators.min(0) ])
    });
  }

  public voegBelasteVergoedingToe(): void {
    this.belasteVergoedingen.push(
      this.maakNaamBedragFormGroup()
    );
  }

  public verwijderBelasteVergoeding(index: number): void {
    this.belasteVergoedingen.removeAt(index);
    this.dataForm.markAsDirty();
  }

  get belasteVergoedingen(): FormArray {
    return (this.dataForm.get('belasteVergoedingen') as FormArray);
  }

  public voegBelasteInhoudingToe(): void {
    this.belasteInhoudingen.push(
      this.maakNaamBedragFormGroup()
    );
  }

  public verwijderBelasteInhouding(index: number): void {
    this.belasteInhoudingen.removeAt(index);
    this.dataForm.markAsDirty();
  }

  get belasteInhoudingen(): FormArray {
    return (this.dataForm.get('belasteInhoudingen') as FormArray);
  }

  public voegOnbelasteVergoedingToe(): void {
    this.onbelasteVergoedingen.push(
      this.maakNaamBedragFormGroup()
    );
  }

  public verwijderOnbelasteVergoeding(index: number): void {
    this.onbelasteVergoedingen.removeAt(index);
    this.dataForm.markAsDirty();
  }

  get onbelasteVergoedingen(): FormArray {
    return (this.dataForm.get('onbelasteVergoedingen') as FormArray);
  }

  public voegOnbelasteInhoudingToe(): void {
    this.onbelasteInhoudingen.push(
      this.maakNaamBedragFormGroup()
    );
  }

  public verwijderOnbelasteInhouding(index: number): void {
    this.onbelasteInhoudingen.removeAt(index);
    this.dataForm.markAsDirty();
  }

  get onbelasteInhoudingen(): FormArray {
    return (this.dataForm.get('onbelasteInhoudingen') as FormArray);
  }
}
