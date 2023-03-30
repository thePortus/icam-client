import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisciplineViewComponent } from './add-discipline-view.component';
import { AddDisciplineComponent } from '../add-discipline/add-discipline.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddDisciplineViewComponent', () => {
  let component: AddDisciplineViewComponent;
  let fixture: ComponentFixture<AddDisciplineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddDisciplineViewComponent,
        AddDisciplineComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatIconModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDisciplineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
