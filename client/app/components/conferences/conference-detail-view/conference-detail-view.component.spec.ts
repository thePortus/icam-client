import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceDetailViewComponent } from './conference-detail-view.component';

describe('ConferenceDetailViewComponent', () => {
  let component: ConferenceDetailViewComponent;
  let fixture: ComponentFixture<ConferenceDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConferenceDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConferenceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
