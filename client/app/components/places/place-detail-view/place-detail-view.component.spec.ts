import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailViewComponent } from './place-detail-view.component';
import { PlaceDetailComponent } from '../place-detail/place-detail.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('PlaceDetailViewComponent', () => {
  let component: PlaceDetailViewComponent;
  let fixture: ComponentFixture<PlaceDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PlaceDetailViewComponent,
        PlaceDetailComponent
      ],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get(): string {
                  return '1';
                },
              },
            },
          }
        }
      ],
      imports:[
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
