import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresentationComponent } from './edit-presentation.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditPresentationComponent', () => {
  let component: EditPresentationComponent;
  let fixture: ComponentFixture<EditPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPresentationComponent ],
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

    fixture = TestBed.createComponent(EditPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
