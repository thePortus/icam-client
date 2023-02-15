import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPresentationsViewComponent } from './list-presentations-view.component';

describe('ListPresentationsViewComponent', () => {
  let component: ListPresentationsViewComponent;
  let fixture: ComponentFixture<ListPresentationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPresentationsViewComponent ]
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
