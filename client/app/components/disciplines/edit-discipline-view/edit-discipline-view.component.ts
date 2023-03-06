import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-edit-discipline-view',
  templateUrl: './edit-discipline-view.component.html',
  styleUrls: ['./edit-discipline-view.component.scss']
})
export class EditDisciplineViewComponent implements OnInit {
  // item id & loading flag
  disciplineId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.disciplineId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
