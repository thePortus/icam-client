import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Topic } from './../../../interfaces/topic.interface';

@Component({
  selector: 'app-select-topic',
  templateUrl: './select-topic.component.html',
  styleUrls: ['./select-topic.component.scss']
})
export class SelectTopicComponent implements OnInit {
  @Output() successfullyAdded = new EventEmitter<string>();
  @Input() idsToRestrictTo: number[] = [];
  @Input() restrictedIds: number[] = [];

  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  selectedTopic: any;
  acceptableTopics: Topic[] = [];
  displayAddTopic: boolean = false;
  filterByTitle: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    let requestString: string = 'topics/?';
    if (this.filterByTitle) {
      requestString += 'title=' + this.filterByTitle;
    }
    this._api.getTypeRequest(requestString).subscribe((res: any) => {
      this.acceptableTopics = res.sort(function(a:any, b:any) {
        // sort list of topics alphabetically by title
        let textA = a.title;
        let textB = b.title;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.loading = false;
    });
  }

  onSubmit() {
    let topicToAdd: any;
    for (let topic of this.acceptableTopics) {
      if (topic.id == this.selectedTopic) {
        topicToAdd = topic;
      }
    }
    this.successfullyAdded.emit(topicToAdd);
  }

  toggleDisplayAddTopic() {
    this.displayAddTopic = !this.displayAddTopic;
  }

  topicAdded(topic: any) {
    this.refreshData();
    this.selectedTopic = topic.id;
    this.displayAddTopic = false;
    this.successfullyAdded.emit(topic);
  }

}
