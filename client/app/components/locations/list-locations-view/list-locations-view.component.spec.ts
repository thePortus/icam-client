import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLocationsViewComponent } from './list-locations-view.component';
import { ListLocationsComponent } from '../list-locations/list-locations.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListLocationsViewComponent', () => {
  let component: ListLocationsViewComponent;
  let fixture: ComponentFixture<ListLocationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListLocationsViewComponent,
        ListLocationsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLocationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
