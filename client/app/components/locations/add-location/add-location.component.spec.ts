import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationComponent } from './add-location.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddLocationComponent', () => {
  let component: AddLocationComponent;
  let fixture: ComponentFixture<AddLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLocationComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports: [
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
