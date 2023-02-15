import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-conference-view',
  templateUrl: './edit-conference-view.component.html',
  styleUrls: ['./edit-conference-view.component.scss']
})
export class EditConferenceViewComponent implements OnInit {
  conferenceId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.conferenceId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
