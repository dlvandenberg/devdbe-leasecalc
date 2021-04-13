import { TestBed } from '@angular/core/testing';

import { LoonheffingService } from './loonheffing.service';

describe('LoonheffingService', () => {
  let service: LoonheffingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new LoonheffingService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return "1051.25" when loon is "3915"', () => {
    const loon = 3915;
    expect(service.calculateLoonheffing(loon)).toEqual(1051.25);
  });

  it('should return "209.42" when loon is "2034"', () => {
    const loon = 2034;
    expect(service.calculateLoonheffing(loon)).toEqual(209.42);
  });

  it('should return "3066.42" when loon is "7753.50"', () => {
    const loon = 7753.50;
    expect(service.calculateLoonheffing(loon)).toEqual(3066.42);
  });

  it('should return "4.92" when loon is "742.50"', () => {
    const loon = 742.50;
    expect(service.calculateLoonheffing(loon)).toEqual(4.92);
  });

  it('should round up to 5 decimals', () => {
    const bedrag = 10.1234567;
    const result = service.rondAfOpDecimalen(bedrag, 5);
    expect(result).toEqual(10.12346);
  });

  it('should round up to 5 decimals', () => {
    const bedrag = 1520.8821912819124;
    const result = service.rondAfOpDecimalen(bedrag, 5);
    expect(result).toEqual(1520.88219);
  });
});
