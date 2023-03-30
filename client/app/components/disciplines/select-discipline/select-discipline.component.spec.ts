import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDisciplineComponent } from './select-discipline.component';

import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SelectDisciplineComponent', () => {
  let component: SelectDisciplineComponent;
  let fixture: ComponentFixture<SelectDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDisciplineComponent ],
      providers: [
        HttpClient,
        HttpHandler
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
