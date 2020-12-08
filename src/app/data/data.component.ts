import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data } from '../model/data.interface';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  public dataForm: FormGroup;
  public data: Data = {
    brutoSalaris: 3828,
    bijtelling: 22,
    leasebudget: 675,
    zorgverzekering: 17.78,
    pensioen: 92.30,
    ouderschapsverlof: 382.82,
    onkostenvergoeding: 81
  };

  constructor(private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // check localstorage
    this.dataForm = this.formBuilder.group({
      brutoSalaris: this.formBuilder.control(this.data.brutoSalaris, [ Validators.required, Validators.min(0) ]),
      bijtelling: this.formBuilder.control(this.data.bijtelling, [ Validators.required, Validators.min(0) ]),
      leasebudget: this.formBuilder.control(this.data.leasebudget, [ Validators.required, Validators.min(0) ]),
      zorgverzekering: this.formBuilder.control(this.data.zorgverzekering, [ Validators.required, Validators.min(0) ]),
      pensioen: this.formBuilder.control(this.data.pensioen, [ Validators.required, Validators.min(0) ]),
      ouderschapsverlof: this.formBuilder.control(this.data.ouderschapsverlof, [ Validators.min(0) ]),
      onkostenvergoeding: this.formBuilder.control(this.data.onkostenvergoeding, [ Validators.min(0) ]),
    });
  }

  public saveData(): void {
    // do something
    console.log(this.dataForm.value);
  }

  get bijtelling(): number {
    return 22;
  }

  get brutoSalarisInvalid(): boolean {
    return this.dataForm.controls.brutoSalaris.dirty && this.dataForm.controls.brutoSalaris.invalid;
  }

  get leasebudgetInvalid(): boolean {
    return this.dataForm.controls.leasebudget.dirty && this.dataForm.controls.leasebudget.invalid;
  }

  get zorgverzekeringInvalid(): boolean {
    return this.dataForm.controls.zorgverzekering.dirty && this.dataForm.controls.zorgverzekering.invalid;
  }

  get pensioenInvalid(): boolean {
    return this.dataForm.controls.pensioen.dirty && this.dataForm.controls.pensioen.invalid;
  }

  get ouderschapsverlofInvalid(): boolean {
    return this.dataForm.controls.ouderschapsverlof.dirty && this.dataForm.controls.ouderschapsverlof.invalid;
  }

  get onkostenvergoedingInvalid(): boolean {
    return this.dataForm.controls.onkostenvergoeding.dirty && this.dataForm.controls.onkostenvergoeding.invalid;
  }
}
