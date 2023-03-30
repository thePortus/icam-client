import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlaceViewComponent } from './edit-place-view.component';
import { EditPlaceComponent } from '../edit-place/edit-place.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditPlaceViewComponent', () => {
  let component: EditPlaceViewComponent;
  let fixture: ComponentFixture<EditPlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditPlaceViewComponent,
        EditPlaceComponent
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
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
