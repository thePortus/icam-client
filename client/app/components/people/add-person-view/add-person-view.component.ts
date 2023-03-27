import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-person-view',
  templateUrl: './add-person-view.component.html',
  styleUrls: ['./add-person-view.component.scss']
})
export class AddPersonViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param person - Object containing added item info
   */
  personAdded(person: any) {
    this._router.navigate(['/people/' + person.id.toString()]);
  }

}
