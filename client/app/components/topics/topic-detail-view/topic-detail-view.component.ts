import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-topic-detail-view',
  templateUrl: './topic-detail-view.component.html',
  styleUrls: ['./topic-detail-view.component.scss']
})
export class TopicDetailViewComponent implements OnInit {
  // item id & loading flag
  topicId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.topicId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
