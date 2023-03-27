import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-place-view',
  templateUrl: './add-place-view.component.html',
  styleUrls: ['./add-place-view.component.scss']
})
export class AddPlaceViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param place - Object containing added item info
   */
  placeAdded(place: any) {
    this._router.navigate(['/places/' + place.id.toString()]);
  }

}
