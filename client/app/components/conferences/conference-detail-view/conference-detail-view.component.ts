import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-conference-detail-view',
  templateUrl: './conference-detail-view.component.html',
  styleUrls: ['./conference-detail-view.component.scss']
})
export class ConferenceDetailViewComponent implements OnInit {
  // item id & loading flag
  conferenceId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.conferenceId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
