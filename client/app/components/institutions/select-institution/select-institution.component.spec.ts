import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInstitutionComponent } from './select-institution.component';

import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SelectInstitutionComponent', () => {
  let component: SelectInstitutionComponent;
  let fixture: ComponentFixture<SelectInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectInstitutionComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
