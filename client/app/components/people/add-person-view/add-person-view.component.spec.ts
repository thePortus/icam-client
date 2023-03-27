import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonViewComponent } from './add-person-view.component';

describe('AddPersonViewComponent', () => {
  let component: AddPersonViewComponent;
  let fixture: ComponentFixture<AddPersonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPersonViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPersonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
