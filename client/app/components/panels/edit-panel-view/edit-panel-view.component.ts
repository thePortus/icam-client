import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-panel-view',
  templateUrl: './edit-panel-view.component.html',
  styleUrls: ['./edit-panel-view.component.scss']
})
export class EditPanelViewComponent implements OnInit {
  panelId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.panelId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
