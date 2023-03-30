import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPanelComponent } from './select-panel.component';

import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SelectPanelComponent', () => {
  let component: SelectPanelComponent;
  let fixture: ComponentFixture<SelectPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPanelComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
