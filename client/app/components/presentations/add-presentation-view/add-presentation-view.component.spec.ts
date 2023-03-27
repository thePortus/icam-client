import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPresentationViewComponent } from './add-presentation-view.component';

describe('AddPresentationViewComponent', () => {
  let component: AddPresentationViewComponent;
  let fixture: ComponentFixture<AddPresentationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPresentationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPresentationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
