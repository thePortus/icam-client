import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCreditsComponent } from './home-credits.component';

describe('HomeCreditsComponent', () => {
  let component: HomeCreditsComponent;
  let fixture: ComponentFixture<HomeCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCreditsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
