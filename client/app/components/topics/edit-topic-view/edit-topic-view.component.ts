import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-topic-view',
  templateUrl: './edit-topic-view.component.html',
  styleUrls: ['./edit-topic-view.component.scss']
})
export class EditTopicViewComponent implements OnInit {
  topicId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.topicId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
