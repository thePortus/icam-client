import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisciplinesComponent } from './list-disciplines.component';

describe('ListDisciplinesComponent', () => {
  let component: ListDisciplinesComponent;
  let fixture: ComponentFixture<ListDisciplinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDisciplinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDisciplinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
