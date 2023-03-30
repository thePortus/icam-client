import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPresentationViewComponent } from './add-presentation-view.component';
import { AddPresentationComponent } from '../add-presentation/add-presentation.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddPresentationViewComponent', () => {
  let component: AddPresentationViewComponent;
  let fixture: ComponentFixture<AddPresentationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddPresentationViewComponent,
        AddPresentationComponent
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

    fixture = TestBed.createComponent(AddPresentationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
