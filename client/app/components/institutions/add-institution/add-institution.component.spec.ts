import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstitutionComponent } from './add-institution.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddInstitutionComponent', () => {
  let component: AddInstitutionComponent;
  let fixture: ComponentFixture<AddInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInstitutionComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports: [
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
