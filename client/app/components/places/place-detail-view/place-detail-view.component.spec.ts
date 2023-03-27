import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDetailViewComponent } from './place-detail-view.component';

describe('PlaceDetailViewComponent', () => {
  let component: PlaceDetailViewComponent;
  let fixture: ComponentFixture<PlaceDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
