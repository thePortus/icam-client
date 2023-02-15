import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  topicAdded(topic: any) {
    this._router.navigate(['/topics/' + topic.id.toString()]);
  }

}
