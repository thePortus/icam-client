import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConferenceViewComponent } from './add-conference-view.component';
import { AddConferenceComponent } from '../add-conference/add-conference.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddConferenceViewComponent', () => {
  let component: AddConferenceViewComponent;
  let fixture: ComponentFixture<AddConferenceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddConferenceViewComponent,
        AddConferenceComponent
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

    fixture = TestBed.createComponent(AddConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
