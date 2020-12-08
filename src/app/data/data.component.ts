import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data } from '../model/data.interface';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  public dataForm: FormGroup;
  public data: Data = {
    brutoSalaris: 0,
    bijtelling: 22,
    leasebudget: 0,
    zorgverzekering: 0,
    pensioen: 0,
    ouderschapsverlof: 0,
    onkostenvergoeding: 0,
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

    this.dataForm = this.formBuilder.group({
      brutoSalaris: this.formBuilder.control(this.data.brutoSalaris, [
        Validators.required,
        Validators.min(0),
      ]),
      bijtelling: this.formBuilder.control(this.data.bijtelling, [
        Validators.required,
        Validators.min(0),
      ]),
      leasebudget: this.formBuilder.control(this.data.leasebudget, [
        Validators.required,
        Validators.min(0),
      ]),
      zorgverzekering: this.formBuilder.control(this.data.zorgverzekering, [
        Validators.required,
        Validators.min(0),
      ]),
      pensioen: this.formBuilder.control(this.data.pensioen, [
        Validators.required,
        Validators.min(0),
      ]),
      ouderschapsverlof: this.formBuilder.control(this.data.ouderschapsverlof, [
        Validators.min(0),
      ]),
      onkostenvergoeding: this.formBuilder.control(
        this.data.onkostenvergoeding,
        [Validators.min(0)]
      ),
    });
  }

  public saveData(): void {
    this.dataService.setData(this.dataForm.value);
    this.router.navigate(['calculate']);
  }

  get bijtelling(): number {
    return this.dataForm.controls.bijtelling.value;
  }

  get brutoSalarisInvalid(): boolean {
    return (
      this.dataForm.controls.brutoSalaris.dirty &&
      this.dataForm.controls.brutoSalaris.invalid
    );
  }

  get leasebudgetInvalid(): boolean {
    return (
      this.dataForm.controls.leasebudget.dirty &&
      this.dataForm.controls.leasebudget.invalid
    );
  }

  get zorgverzekeringInvalid(): boolean {
    return (
      this.dataForm.controls.zorgverzekering.dirty &&
      this.dataForm.controls.zorgverzekering.invalid
    );
  }

  get pensioenInvalid(): boolean {
    return (
      this.dataForm.controls.pensioen.dirty &&
      this.dataForm.controls.pensioen.invalid
    );
  }

  get ouderschapsverlofInvalid(): boolean {
    return (
      this.dataForm.controls.ouderschapsverlof.dirty &&
      this.dataForm.controls.ouderschapsverlof.invalid
    );
  }

  get onkostenvergoedingInvalid(): boolean {
    return (
      this.dataForm.controls.onkostenvergoeding.dirty &&
      this.dataForm.controls.onkostenvergoeding.invalid
    );
  }
}
