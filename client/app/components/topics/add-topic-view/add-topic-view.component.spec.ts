import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTopicViewComponent } from './add-topic-view.component';

describe('AddTopicViewComponent', () => {
  let component: AddTopicViewComponent;
  let fixture: ComponentFixture<AddTopicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTopicViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
