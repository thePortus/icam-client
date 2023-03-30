import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPanelViewComponent } from './add-panel-view.component';
import { AddPanelComponent } from '../add-panel/add-panel.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddPanelViewComponent', () => {
  let component: AddPanelViewComponent;
  let fixture: ComponentFixture<AddPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddPanelViewComponent,
        AddPanelComponent
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

    fixture = TestBed.createComponent(AddPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
