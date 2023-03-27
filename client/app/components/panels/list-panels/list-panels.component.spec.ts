import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPanelsComponent } from './list-panels.component';

describe('ListPanelsComponent', () => {
  let component: ListPanelsComponent;
  let fixture: ComponentFixture<ListPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPanelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
