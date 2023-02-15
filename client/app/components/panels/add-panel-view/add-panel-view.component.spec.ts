import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPanelViewComponent } from './add-panel-view.component';

describe('AddPanelViewComponent', () => {
  let component: AddPanelViewComponent;
  let fixture: ComponentFixture<AddPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPanelViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
