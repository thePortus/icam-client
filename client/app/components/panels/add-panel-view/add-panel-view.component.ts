import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-panel-view',
  templateUrl: './add-panel-view.component.html',
  styleUrls: ['./add-panel-view.component.scss']
})
export class AddPanelViewComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  panelAdded(panel: any) {
    this._router.navigate(['/panels/' + panel.id.toString()]);
  }

}
