import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPresentationComponent } from './select-presentation.component';

describe('SelectPresentationComponent', () => {
  let component: SelectPresentationComponent;
  let fixture: ComponentFixture<SelectPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
