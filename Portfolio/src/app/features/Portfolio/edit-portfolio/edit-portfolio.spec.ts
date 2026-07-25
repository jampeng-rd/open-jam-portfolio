import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPortfolio } from './edit-portfolio';

describe('EditPortfolio', () => {
  let component: EditPortfolio;
  let fixture: ComponentFixture<EditPortfolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPortfolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPortfolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
