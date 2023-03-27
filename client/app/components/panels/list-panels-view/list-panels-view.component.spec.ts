import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPanelsViewComponent } from './list-panels-view.component';

describe('ListPanelsViewComponent', () => {
  let component: ListPanelsViewComponent;
  let fixture: ComponentFixture<ListPanelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPanelsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPanelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
