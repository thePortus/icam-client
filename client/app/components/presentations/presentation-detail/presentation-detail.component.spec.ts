import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationDetailComponent } from './presentation-detail.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';

describe('PresentationDetailComponent', () => {
  let component: PresentationDetailComponent;
  let fixture: ComponentFixture<PresentationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationDetailComponent ],
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

    fixture = TestBed.createComponent(PresentationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
