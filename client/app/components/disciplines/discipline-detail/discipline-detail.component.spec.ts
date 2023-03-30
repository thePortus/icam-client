import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineDetailComponent } from './discipline-detail.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule} from '@angular/material/icon';

describe('DisciplineDetailComponent', () => {
  let component: DisciplineDetailComponent;
  let fixture: ComponentFixture<DisciplineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplineDetailComponent ],
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

    fixture = TestBed.createComponent(DisciplineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
