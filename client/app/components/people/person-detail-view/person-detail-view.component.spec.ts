import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailViewComponent } from './person-detail-view.component';

describe('PersonDetailViewComponent', () => {
  let component: PersonDetailViewComponent;
  let fixture: ComponentFixture<PersonDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
