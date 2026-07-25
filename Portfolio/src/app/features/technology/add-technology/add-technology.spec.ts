import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnology } from './add-technology';

describe('AddTechnology', () => {
  let component: AddTechnology;
  let fixture: ComponentFixture<AddTechnology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTechnology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTechnology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
