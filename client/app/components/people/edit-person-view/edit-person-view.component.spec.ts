import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonViewComponent } from './edit-person-view.component';

describe('EditPersonViewComponent', () => {
  let component: EditPersonViewComponent;
  let fixture: ComponentFixture<EditPersonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPersonViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPersonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
