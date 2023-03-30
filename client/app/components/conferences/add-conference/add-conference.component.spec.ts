import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConferenceComponent } from './add-conference.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddConferenceComponent', () => {
  let component: AddConferenceComponent;
  let fixture: ComponentFixture<AddConferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConferenceComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports: [
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
