import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstitutionsViewComponent } from './list-institutions-view.component';

describe('ListInstitutionsViewComponent', () => {
  let component: ListInstitutionsViewComponent;
  let fixture: ComponentFixture<ListInstitutionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInstitutionsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInstitutionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
