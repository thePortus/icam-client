import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaceViewComponent } from './add-place-view.component';

describe('AddPlaceViewComponent', () => {
  let component: AddPlaceViewComponent;
  let fixture: ComponentFixture<AddPlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlaceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
