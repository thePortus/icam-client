import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-edit-institution-view',
  templateUrl: './edit-institution-view.component.html',
  styleUrls: ['./edit-institution-view.component.scss']
})
export class EditInstitutionViewComponent implements OnInit {
  // item id & loading flag
  institutionId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.institutionId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
