import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDisciplineViewComponent } from './edit-discipline-view.component';

describe('EditDisciplineViewComponent', () => {
  let component: EditDisciplineViewComponent;
  let fixture: ComponentFixture<EditDisciplineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDisciplineViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDisciplineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
