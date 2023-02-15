import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConferencesViewComponent } from './list-conferences-view.component';

describe('ListConferencesViewComponent', () => {
  let component: ListConferencesViewComponent;
  let fixture: ComponentFixture<ListConferencesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConferencesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConferencesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
