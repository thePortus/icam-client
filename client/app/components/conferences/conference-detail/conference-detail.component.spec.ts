import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceDetailComponent } from './conference-detail.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';

describe('ConferenceDetailComponent', () => {
  let component: ConferenceDetailComponent;
  let fixture: ComponentFixture<ConferenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConferenceDetailComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatSnackBarModule,
        MatDialogModule,
        MatIconModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
