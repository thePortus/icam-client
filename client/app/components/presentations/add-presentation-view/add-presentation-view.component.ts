import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-presentation-view',
  templateUrl: './add-presentation-view.component.html',
  styleUrls: ['./add-presentation-view.component.scss']
})
export class AddPresentationViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param presentation - Object containing added item info
   */
  presentationAdded(presentation: any) {
    this._router.navigate(['/presentations/' + presentation.id.toString()]);
  }

}
