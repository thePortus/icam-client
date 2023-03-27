import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlacesViewComponent } from './list-places-view.component';

describe('ListPlacesViewComponent', () => {
  let component: ListPlacesViewComponent;
  let fixture: ComponentFixture<ListPlacesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPlacesViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlacesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
