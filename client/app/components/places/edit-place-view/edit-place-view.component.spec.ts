import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlaceViewComponent } from './edit-place-view.component';

describe('EditPlaceViewComponent', () => {
  let component: EditPlaceViewComponent;
  let fixture: ComponentFixture<EditPlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlaceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
