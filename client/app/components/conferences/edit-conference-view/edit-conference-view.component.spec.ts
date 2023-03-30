import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConferenceViewComponent } from './edit-conference-view.component';
import { EditConferenceComponent } from '../edit-conference/edit-conference.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditConferenceViewComponent', () => {
  let component: EditConferenceViewComponent;
  let fixture: ComponentFixture<EditConferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditConferenceViewComponent,
        EditConferenceComponent
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

    fixture = TestBed.createComponent(EditConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
