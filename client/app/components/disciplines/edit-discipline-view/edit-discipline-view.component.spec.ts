import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDisciplineViewComponent } from './edit-discipline-view.component';
import { EditDisciplineComponent } from '../edit-discipline/edit-discipline.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditDisciplineViewComponent', () => {
  let component: EditDisciplineViewComponent;
  let fixture: ComponentFixture<EditDisciplineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditDisciplineViewComponent,
        EditDisciplineComponent
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

    fixture = TestBed.createComponent(EditDisciplineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
