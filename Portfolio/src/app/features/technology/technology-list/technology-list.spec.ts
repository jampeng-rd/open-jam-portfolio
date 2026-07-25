import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyList } from './technology-list';

describe('TechnologyList', () => {
  let component: TechnologyList;
  let fixture: ComponentFixture<TechnologyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
