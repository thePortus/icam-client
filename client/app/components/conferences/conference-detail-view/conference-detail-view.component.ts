import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conference-detail-view',
  templateUrl: './conference-detail-view.component.html',
  styleUrls: ['./conference-detail-view.component.scss']
})
export class ConferenceDetailViewComponent implements OnInit {
  conferenceId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.conferenceId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
