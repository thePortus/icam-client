import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-panel-view',
  templateUrl: './add-panel-view.component.html',
  styleUrls: ['./add-panel-view.component.scss']
})
export class AddPanelViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param panel - Object containing added item info
   */
  panelAdded(panel: any) {
    this._router.navigate(['/panels/' + panel.id.toString()]);
  }

}
