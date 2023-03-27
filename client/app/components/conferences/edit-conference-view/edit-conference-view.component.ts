import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-edit-conference-view',
  templateUrl: './edit-conference-view.component.html',
  styleUrls: ['./edit-conference-view.component.scss']
})
export class EditConferenceViewComponent implements OnInit {
  // item id & loading flag
  conferenceId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.conferenceId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
