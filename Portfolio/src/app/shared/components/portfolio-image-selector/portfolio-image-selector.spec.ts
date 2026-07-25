import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioImageSelector } from './portfolio-image-selector';

describe('PortfolioImageSelector', () => {
  let component: PortfolioImageSelector;
  let fixture: ComponentFixture<PortfolioImageSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioImageSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioImageSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
