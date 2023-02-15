import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel-detail-view',
  templateUrl: './panel-detail-view.component.html',
  styleUrls: ['./panel-detail-view.component.scss']
})
export class PanelDetailViewComponent implements OnInit {
  panelId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.panelId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
