import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationsViewComponent } from './add-locations-view.component';
import { AddLocationComponent } from '../add-location/add-location.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddLocationsViewComponent', () => {
  let component: AddLocationsViewComponent;
  let fixture: ComponentFixture<AddLocationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddLocationsViewComponent,
        AddLocationComponent
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

    fixture = TestBed.createComponent(AddLocationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
