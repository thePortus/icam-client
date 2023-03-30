import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopicComponent } from './edit-topic.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule} from '@angular/material/icon';

describe('EditTopicComponent', () => {
  let component: EditTopicComponent;
  let fixture: ComponentFixture<EditTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTopicComponent ],
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

    fixture = TestBed.createComponent(EditTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
