import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConferencesViewComponent } from './list-conferences-view.component';
import { ListConferencesComponent } from '../list-conferences/list-conferences.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListConferencesViewComponent', () => {
  let component: ListConferencesViewComponent;
  let fixture: ComponentFixture<ListConferencesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListConferencesViewComponent,
        ListConferencesComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConferencesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
