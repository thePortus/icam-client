import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-presentation-detail-view',
  templateUrl: './presentation-detail-view.component.html',
  styleUrls: ['./presentation-detail-view.component.scss']
})
export class PresentationDetailViewComponent implements OnInit {
  presentationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.presentationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
