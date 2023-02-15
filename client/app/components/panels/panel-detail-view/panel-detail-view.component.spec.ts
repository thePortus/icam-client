import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDetailViewComponent } from './panel-detail-view.component';

describe('PanelDetailViewComponent', () => {
  let component: PanelDetailViewComponent;
  let fixture: ComponentFixture<PanelDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
