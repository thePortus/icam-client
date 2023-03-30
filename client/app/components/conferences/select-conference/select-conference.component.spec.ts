import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConferenceComponent } from './select-conference.component';

import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SelectConferenceComponent', () => {
  let component: SelectConferenceComponent;
  let fixture: ComponentFixture<SelectConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectConferenceComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ]
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
