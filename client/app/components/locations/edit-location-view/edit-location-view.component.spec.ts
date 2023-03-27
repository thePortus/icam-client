import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocationViewComponent } from './edit-location-view.component';

describe('EditLocationViewComponent', () => {
  let component: EditLocationViewComponent;
  let fixture: ComponentFixture<EditLocationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLocationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLocationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
