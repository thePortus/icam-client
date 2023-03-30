import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstitutionViewComponent } from './add-institution-view.component';
import { AddInstitutionComponent } from '../add-institution/add-institution.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddInstitutionViewComponent', () => {
  let component: AddInstitutionViewComponent;
  let fixture: ComponentFixture<AddInstitutionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddInstitutionViewComponent,
        AddInstitutionComponent
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

    fixture = TestBed.createComponent(AddInstitutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
