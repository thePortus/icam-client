import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConferencesComponent } from './list-conferences.component';

describe('ListConferencesComponent', () => {
  let component: ListConferencesComponent;
  let fixture: ComponentFixture<ListConferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListConferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
