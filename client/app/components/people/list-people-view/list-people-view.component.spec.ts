import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPeopleViewComponent } from './list-people-view.component';
import { ListPeopleComponent } from '../list-people/list-people.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListPeopleViewComponent', () => {
  let component: ListPeopleViewComponent;
  let fixture: ComponentFixture<ListPeopleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListPeopleViewComponent,
        ListPeopleComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPeopleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
