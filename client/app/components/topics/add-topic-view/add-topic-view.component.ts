import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-topic-view',
  templateUrl: './add-topic-view.component.html',
  styleUrls: ['./add-topic-view.component.scss']
})
export class AddTopicViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param topic - Object containing added item info
   */
  topicAdded(topic: any) {
    this._router.navigate(['/topics/' + topic.id.toString()]);
  }

}
