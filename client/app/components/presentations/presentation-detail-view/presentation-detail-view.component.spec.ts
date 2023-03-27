import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationDetailViewComponent } from './presentation-detail-view.component';

describe('PresentationDetailViewComponent', () => {
  let component: PresentationDetailViewComponent;
  let fixture: ComponentFixture<PresentationDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
