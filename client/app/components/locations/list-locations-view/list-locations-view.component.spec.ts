import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLocationsViewComponent } from './list-locations-view.component';

describe('ListLocationsViewComponent', () => {
  let component: ListLocationsViewComponent;
  let fixture: ComponentFixture<ListLocationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLocationsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLocationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
