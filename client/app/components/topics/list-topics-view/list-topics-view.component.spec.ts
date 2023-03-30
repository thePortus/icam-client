import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTopicsViewComponent } from './list-topics-view.component';
import { ListTopicsComponent } from '../list-topics/list-topics.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListTopicsViewComponent', () => {
  let component: ListTopicsViewComponent;
  let fixture: ComponentFixture<ListTopicsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListTopicsViewComponent,
        ListTopicsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTopicsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
