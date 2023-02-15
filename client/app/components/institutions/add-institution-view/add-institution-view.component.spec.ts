import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstitutionViewComponent } from './add-institution-view.component';

describe('AddInstitutionViewComponent', () => {
  let component: AddInstitutionViewComponent;
  let fixture: ComponentFixture<AddInstitutionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInstitutionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInstitutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
