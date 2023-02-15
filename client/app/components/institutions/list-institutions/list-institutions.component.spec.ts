import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstitutionsComponent } from './list-institutions.component';

describe('ListInstitutionsComponent', () => {
  let component: ListInstitutionsComponent;
  let fixture: ComponentFixture<ListInstitutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstitutionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
