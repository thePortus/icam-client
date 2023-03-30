import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaceViewComponent } from './add-place-view.component';
import { AddPlaceComponent } from '../add-place/add-place.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddPlaceViewComponent', () => {
  let component: AddPlaceViewComponent;
  let fixture: ComponentFixture<AddPlaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddPlaceViewComponent,
        AddPlaceComponent
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

    fixture = TestBed.createComponent(AddPlaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
