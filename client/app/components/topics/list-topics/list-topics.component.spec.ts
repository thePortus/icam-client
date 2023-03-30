import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTopicsComponent } from './list-topics.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListTopicsComponent', () => {
  let component: ListTopicsComponent;
  let fixture: ComponentFixture<ListTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTopicsComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatIconModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
