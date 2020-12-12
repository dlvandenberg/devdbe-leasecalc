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

  it('should return "1102.17" when loon is "3915"', () => {
    const loon = 3915;
    expect(service.calculateLoonheffing(loon)).toEqual(1102.17);
  });

  it('should return "1655.83" when loon is "5044.50"', () => {
    const loon = 2034;
    expect(service.calculateLoonheffing(loon)).toEqual(247.33);
  });

  it('should return "3116.33" when loon is "7753.50"', () => {
    const loon = 7753.50;
    expect(service.calculateLoonheffing(loon)).toEqual(3116.33);
  });

  it('should return "30.42" when loon is "742.50"', () => {
    const loon = 742.50;
    expect(service.calculateLoonheffing(loon)).toEqual(30.42);
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
