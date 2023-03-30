import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPanelsViewComponent } from './list-panels-view.component';
import { ListPanelsComponent } from '../list-panels/list-panels.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListPanelsViewComponent', () => {
  let component: ListPanelsViewComponent;
  let fixture: ComponentFixture<ListPanelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListPanelsViewComponent,
        ListPanelsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPanelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
