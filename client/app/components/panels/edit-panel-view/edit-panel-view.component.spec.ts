import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPanelViewComponent } from './edit-panel-view.component';

describe('EditPanelViewComponent', () => {
  let component: EditPanelViewComponent;
  let fixture: ComponentFixture<EditPanelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPanelViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPanelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
