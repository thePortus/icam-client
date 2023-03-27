import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstitutionViewComponent } from './edit-institution-view.component';

describe('EditInstitutionViewComponent', () => {
  let component: EditInstitutionViewComponent;
  let fixture: ComponentFixture<EditInstitutionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInstitutionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInstitutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
