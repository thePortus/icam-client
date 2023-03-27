import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationsViewComponent } from './add-locations-view.component';

describe('AddLocationsViewComponent', () => {
  let component: AddLocationsViewComponent;
  let fixture: ComponentFixture<AddLocationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLocationsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
