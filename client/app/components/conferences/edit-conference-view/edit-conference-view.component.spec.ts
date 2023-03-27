import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConferenceViewComponent } from './edit-conference-view.component';

describe('EditConferenceViewComponent', () => {
  let component: EditConferenceViewComponent;
  let fixture: ComponentFixture<EditConferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConferenceViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
