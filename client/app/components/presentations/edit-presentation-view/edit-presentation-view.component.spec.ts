import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresentationViewComponent } from './edit-presentation-view.component';
import { EditPresentationComponent } from '../edit-presentation/edit-presentation.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditPresentationViewComponent', () => {
  let component: EditPresentationViewComponent;
  let fixture: ComponentFixture<EditPresentationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditPresentationViewComponent,
        EditPresentationComponent
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

    fixture = TestBed.createComponent(EditPresentationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
