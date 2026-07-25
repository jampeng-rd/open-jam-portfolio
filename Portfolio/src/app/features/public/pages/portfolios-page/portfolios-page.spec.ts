import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfoliosPage } from './portfolios-page';

describe('PortfoliosPage', () => {
  let component: PortfoliosPage;
  let fixture: ComponentFixture<PortfoliosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfoliosPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfoliosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
