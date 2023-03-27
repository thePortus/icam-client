import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-conference-view',
  templateUrl: './add-conference-view.component.html',
  styleUrls: ['./add-conference-view.component.scss']
})
export class AddConferenceViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param conference - Object containing added item info
   */
  conferenceAdded(conference: any) {
    this._router.navigate(['/conferences/' + conference.id.toString()]);
  }

}
