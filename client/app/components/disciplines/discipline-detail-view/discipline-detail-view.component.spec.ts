import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisciplineDetailViewComponent } from './discipline-detail-view.component';

describe('DisciplineDetailViewComponent', () => {
  let component: DisciplineDetailViewComponent;
  let fixture: ComponentFixture<DisciplineDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisciplineDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisciplineDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
