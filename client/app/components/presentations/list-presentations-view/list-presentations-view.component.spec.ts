import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPresentationsViewComponent } from './list-presentations-view.component';
import { ListPresentationsComponent } from '../list-presentations/list-presentations.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListPresentationsViewComponent', () => {
  let component: ListPresentationsViewComponent;
  let fixture: ComponentFixture<ListPresentationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        ListPresentationsViewComponent,
        ListPresentationsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPresentationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
