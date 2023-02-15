import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisciplineViewComponent } from './add-discipline-view.component';

describe('AddDisciplineViewComponent', () => {
  let component: AddDisciplineViewComponent;
  let fixture: ComponentFixture<AddDisciplineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDisciplineViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDisciplineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
