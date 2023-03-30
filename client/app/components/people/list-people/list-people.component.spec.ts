import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPeopleComponent } from './list-people.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListPeopleComponent', () => {
  let component: ListPeopleComponent;
  let fixture: ComponentFixture<ListPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPeopleComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatIconModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
