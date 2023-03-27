import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-add-discipline-view',
  templateUrl: './add-discipline-view.component.html',
  styleUrls: ['./add-discipline-view.component.scss']
})
export class AddDisciplineViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Event handler called when add widget emits an added item. Navigates
   * to the list view for items.
   * @param discipline - Object containing added item info
   */
  disciplineAdded(discipline: any) {
    this._router.navigate(['/disciplines/' + discipline.id.toString()]);
  }

}
