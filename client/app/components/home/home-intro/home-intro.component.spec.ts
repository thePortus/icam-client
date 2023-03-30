import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIntroComponent } from './home-intro.component';

import { MatCardModule } from '@angular/material/card';

describe('HomeIntroComponent', () => {
  let component: HomeIntroComponent;
  let fixture: ComponentFixture<HomeIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeIntroComponent ],
      imports: [ MatCardModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
