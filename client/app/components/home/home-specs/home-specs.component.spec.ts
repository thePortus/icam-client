import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSpecsComponent } from './home-specs.component';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

describe('HomeSpecsComponent', () => {
  let component: HomeSpecsComponent;
  let fixture: ComponentFixture<HomeSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSpecsComponent ],
      imports: [
        MatCardModule,
        MatListModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
