import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlacesViewComponent } from './list-places-view.component';
import { ListPlacesComponent } from '../list-places/list-places.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListPlacesViewComponent', () => {
  let component: ListPlacesViewComponent;
  let fixture: ComponentFixture<ListPlacesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListPlacesViewComponent,
        ListPlacesComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlacesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
