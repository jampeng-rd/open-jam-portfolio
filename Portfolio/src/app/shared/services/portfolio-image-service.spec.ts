import { TestBed } from '@angular/core/testing';

import { PortfolioImageService } from './portfolio-image-service';

describe('PortfolioImageService', () => {
  let service: PortfolioImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
