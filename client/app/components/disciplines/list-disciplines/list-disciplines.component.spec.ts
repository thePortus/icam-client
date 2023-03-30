import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisciplinesComponent } from './list-disciplines.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListDisciplinesComponent', () => {
  let component: ListDisciplinesComponent;
  let fixture: ComponentFixture<ListDisciplinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDisciplinesComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[
        MatIconModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
