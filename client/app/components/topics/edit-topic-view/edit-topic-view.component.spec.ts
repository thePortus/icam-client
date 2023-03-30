import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopicViewComponent } from './edit-topic-view.component';
import { EditTopicComponent } from '../edit-topic/edit-topic.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditTopicViewComponent', () => {
  let component: EditTopicViewComponent;
  let fixture: ComponentFixture<EditTopicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditTopicViewComponent,
        EditTopicComponent
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

    fixture = TestBed.createComponent(EditTopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
