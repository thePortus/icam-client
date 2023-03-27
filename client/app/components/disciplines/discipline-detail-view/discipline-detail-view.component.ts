import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-discipline-detail-view',
  templateUrl: './discipline-detail-view.component.html',
  styleUrls: ['./discipline-detail-view.component.scss']
})
export class DisciplineDetailViewComponent implements OnInit {
  // item id & loading flag
  disciplineId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.disciplineId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
