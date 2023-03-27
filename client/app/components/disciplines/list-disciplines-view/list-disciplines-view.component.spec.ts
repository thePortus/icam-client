import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisciplinesViewComponent } from './list-disciplines-view.component';

describe('ListDisciplinesViewComponent', () => {
  let component: ListDisciplinesViewComponent;
  let fixture: ComponentFixture<ListDisciplinesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDisciplinesViewComponent ]
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
