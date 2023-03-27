import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopicViewComponent } from './edit-topic-view.component';

describe('EditTopicViewComponent', () => {
  let component: EditTopicViewComponent;
  let fixture: ComponentFixture<EditTopicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTopicViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTopicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
