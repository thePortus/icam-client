import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDetailComponent } from './panel-detail.component';

describe('PanelDetailComponent', () => {
  let component: PanelDetailComponent;
  let fixture: ComponentFixture<PanelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
