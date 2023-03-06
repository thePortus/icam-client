import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-edit-panel-view',
  templateUrl: './edit-panel-view.component.html',
  styleUrls: ['./edit-panel-view.component.scss']
})
export class EditPanelViewComponent implements OnInit {
  // item id & loading flag
  panelId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.panelId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
