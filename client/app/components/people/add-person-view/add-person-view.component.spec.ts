import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonViewComponent } from './add-person-view.component';
import { AddPersonComponent } from '../add-person/add-person.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddPersonViewComponent', () => {
  let component: AddPersonViewComponent;
  let fixture: ComponentFixture<AddPersonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddPersonViewComponent,
        AddPersonComponent
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

    fixture = TestBed.createComponent(AddPersonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
