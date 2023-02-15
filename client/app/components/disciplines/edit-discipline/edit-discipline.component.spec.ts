import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDisciplineComponent } from './edit-discipline.component';

describe('EditDisciplineComponent', () => {
  let component: EditDisciplineComponent;
  let fixture: ComponentFixture<EditDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDisciplineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
