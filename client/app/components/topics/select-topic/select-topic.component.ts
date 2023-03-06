import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { ApiService } from './../../../services/api.service';
import { Topic } from './../../../interfaces/topic.interface';

@Component({
  selector: 'app-select-topic',
  templateUrl: './select-topic.component.html',
  styleUrls: ['./select-topic.component.scss']
})
export class SelectTopicComponent implements OnInit {
  // event emitter
  @Output() successfullyAdded = new EventEmitter<string>();
  // optional, if provided only allow selection from items with matching ids
  @Input() idsToRestrictTo: number[] = [];
  // optional, if provided filter items with matching ids from selection
  @Input() restrictedIds: number[] = [];

  // loading flag & error messages
  loading: boolean = true;
  errorMsgs: string[] = [];
  serverErrorMsgs: string[] = [];
  // selected item
  selectedTopic: any;
  // all possible items
  acceptableTopics: Topic[] = [];
  // add new item flag
  displayAddTopic: boolean = false;
  // filter
  filterByTitle: string = '';

  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.refreshData();
  }

  /**
   * Refreshes data from server and stores in acceptable items. Uses
   * pagination and filter information to only retrieve pertinent items.
   * Also calculates total number of items and sets loading to false.
   */
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

  /**
   * On selection, emits the data of the selected item.
   */
  onSubmit() {
    let topicToAdd: any;
    for (let topic of this.acceptableTopics) {
      if (topic.id == this.selectedTopic) {
        topicToAdd = topic;
      }
    }
    this.successfullyAdded.emit(topicToAdd);
  }

  /**
   * Toggles whether to display/hide the add item widget.
   */
  toggleDisplayAddTopic() {
    this.displayAddTopic = !this.displayAddTopic;
  }

  /**
   * Executes when add item widget emits an event handler. Refreshes data,
   * sets the selected item to the added item, toggles the display add item
   * to false, and itself emits the selection to any parent.
   * 
   * @param topic - the data of the added item, emitted by a child widget
   */
  topicAdded(topic: any) {
    this.refreshData();
    this.selectedTopic = topic.id;
    this.displayAddTopic = false;
    // emit selection
    this.successfullyAdded.emit(topic);
  }

}
