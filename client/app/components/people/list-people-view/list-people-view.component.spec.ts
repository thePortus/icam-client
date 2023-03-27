import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPeopleViewComponent } from './list-people-view.component';

describe('ListPeopleViewComponent', () => {
  let component: ListPeopleViewComponent;
  let fixture: ComponentFixture<ListPeopleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPeopleViewComponent ]
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
