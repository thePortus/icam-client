import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-locations-view',
  templateUrl: './add-locations-view.component.html',
  styleUrls: ['./add-locations-view.component.scss']
})
export class AddLocationsViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param location - Object containing added item info
   */
  locationAdded(location: any) {
    this._router.navigate(['/locations/' + location.id.toString()]);
  }

}
