import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisciplinesViewComponent } from './list-disciplines-view.component';
import { ListDisciplinesComponent } from '../list-disciplines/list-disciplines.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListDisciplinesViewComponent', () => {
  let component: ListDisciplinesViewComponent;
  let fixture: ComponentFixture<ListDisciplinesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListDisciplinesViewComponent,
        ListDisciplinesComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDisciplinesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
