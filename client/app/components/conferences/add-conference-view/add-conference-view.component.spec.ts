import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConferenceViewComponent } from './add-conference-view.component';

describe('AddConferenceViewComponent', () => {
  let component: AddConferenceViewComponent;
  let fixture: ComponentFixture<AddConferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConferenceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
