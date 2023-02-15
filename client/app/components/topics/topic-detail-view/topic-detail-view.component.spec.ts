import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicDetailViewComponent } from './topic-detail-view.component';

describe('TopicDetailViewComponent', () => {
  let component: TopicDetailViewComponent;
  let fixture: ComponentFixture<TopicDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicDetailViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
