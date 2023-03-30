import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPanelViewComponent } from './edit-panel-view.component';
import { EditPanelComponent } from '../edit-panel/edit-panel.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditPanelViewComponent', () => {
  let component: EditPanelViewComponent;
  let fixture: ComponentFixture<EditPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditPanelViewComponent,
        EditPanelComponent
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

    fixture = TestBed.createComponent(EditPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
