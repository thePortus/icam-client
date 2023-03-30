import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTopicComponent } from './add-topic.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddTopicComponent', () => {
  let component: AddTopicComponent;
  let fixture: ComponentFixture<AddTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTopicComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports: [
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
