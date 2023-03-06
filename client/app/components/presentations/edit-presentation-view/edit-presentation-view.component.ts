import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * This is a view component which acts as a wrapper to a subwidget
 */
@Component({
  selector: 'app-edit-presentation-view',
  templateUrl: './edit-presentation-view.component.html',
  styleUrls: ['./edit-presentation-view.component.scss']
})
export class EditPresentationViewComponent implements OnInit {
  // item id & loading flag
  presentationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  /**
   * Gets item ID from route snapeshot and sets .loading to false
   */
  ngOnInit(): void {
    this.presentationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
