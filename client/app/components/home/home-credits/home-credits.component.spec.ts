import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCreditsComponent } from './home-credits.component';

import { MatCardModule } from '@angular/material/card';

describe('HomeCreditsComponent', () => {
  let component: HomeCreditsComponent;
  let fixture: ComponentFixture<HomeCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCreditsComponent ],
      imports: [ MatCardModule ]
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
