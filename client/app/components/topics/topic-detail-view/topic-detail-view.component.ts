import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-detail-view',
  templateUrl: './topic-detail-view.component.html',
  styleUrls: ['./topic-detail-view.component.scss']
})
export class TopicDetailViewComponent implements OnInit {
  topicId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.topicId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
