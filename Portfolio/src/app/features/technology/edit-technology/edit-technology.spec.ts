import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTechnology } from './edit-technology';

describe('EditTechnology', () => {
  let component: EditTechnology;
  let fixture: ComponentFixture<EditTechnology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTechnology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTechnology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
