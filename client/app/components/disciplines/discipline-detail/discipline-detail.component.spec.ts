import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineDetailComponent } from './discipline-detail.component';

describe('DisciplineDetailComponent', () => {
  let component: DisciplineDetailComponent;
  let fixture: ComponentFixture<DisciplineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplineDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
