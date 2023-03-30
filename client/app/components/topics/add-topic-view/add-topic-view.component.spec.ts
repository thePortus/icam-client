import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTopicViewComponent } from './add-topic-view.component';
import { AddTopicComponent } from '../add-topic/add-topic.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddTopicViewComponent', () => {
  let component: AddTopicViewComponent;
  let fixture: ComponentFixture<AddTopicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddTopicViewComponent,
        AddTopicComponent
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

    fixture = TestBed.createComponent(AddTopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
