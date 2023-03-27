import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTopicsViewComponent } from './list-topics-view.component';

describe('ListTopicsViewComponent', () => {
  let component: ListTopicsViewComponent;
  let fixture: ComponentFixture<ListTopicsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTopicsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTopicsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
