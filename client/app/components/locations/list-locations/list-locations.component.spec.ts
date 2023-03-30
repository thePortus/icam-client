import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLocationsComponent } from './list-locations.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListLocationsComponent', () => {
  let component: ListLocationsComponent;
  let fixture: ComponentFixture<ListLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLocationsComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatIconModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
