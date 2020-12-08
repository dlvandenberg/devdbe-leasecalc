import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoonheffingComponent } from './loonheffing.component';

describe('LoonheffingComponent', () => {
  let component: LoonheffingComponent;
  let fixture: ComponentFixture<LoonheffingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoonheffingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoonheffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
