import { TestBed } from '@angular/core/testing';
import { MilestoneService } from './milestone.service';

describe('Database', () => {
  let service: MilestoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MilestoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
