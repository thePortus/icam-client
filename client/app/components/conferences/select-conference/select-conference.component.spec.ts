import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConferenceComponent } from './select-conference.component';

describe('SelectConferenceComponent', () => {
  let component: SelectConferenceComponent;
  let fixture: ComponentFixture<SelectConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
