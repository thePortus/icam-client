import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPersonComponent } from './select-person.component';

import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SelectPersonComponent', () => {
  let component: SelectPersonComponent;
  let fixture: ComponentFixture<SelectPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPersonComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
