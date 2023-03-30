import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInstitutionsViewComponent } from './list-institutions-view.component';
import { ListInstitutionsComponent } from '../list-institutions/list-institutions.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatIconModule} from '@angular/material/icon';

describe('ListInstitutionsViewComponent', () => {
  let component: ListInstitutionsViewComponent;
  let fixture: ComponentFixture<ListInstitutionsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListInstitutionsViewComponent,
        ListInstitutionsComponent
      ],
      providers: [
        HttpClient,
        HttpHandler
      ],
      imports:[ MatIconModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInstitutionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
