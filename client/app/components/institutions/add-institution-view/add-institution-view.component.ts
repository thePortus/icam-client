import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-institution-view',
  templateUrl: './add-institution-view.component.html',
  styleUrls: ['./add-institution-view.component.scss']
})
export class AddInstitutionViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param institution - Object containing added item info
   */
  institutionAdded(institution: any) {
    this._router.navigate(['/institutions/' + institution.id.toString()]);
  }

}
