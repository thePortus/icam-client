import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresentationViewComponent } from './edit-presentation-view.component';

describe('EditPresentationViewComponent', () => {
  let component: EditPresentationViewComponent;
  let fixture: ComponentFixture<EditPresentationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPresentationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPresentationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
