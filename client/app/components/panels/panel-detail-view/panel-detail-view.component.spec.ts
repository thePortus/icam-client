import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDetailViewComponent } from './panel-detail-view.component';
import { PanelDetailComponent } from '../panel-detail/panel-detail.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('PanelDetailViewComponent', () => {
  let component: PanelDetailViewComponent;
  let fixture: ComponentFixture<PanelDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PanelDetailViewComponent,
        PanelDetailComponent
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

    fixture = TestBed.createComponent(PanelDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
