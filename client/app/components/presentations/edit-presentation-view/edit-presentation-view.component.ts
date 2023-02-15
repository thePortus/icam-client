import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-presentation-view',
  templateUrl: './edit-presentation-view.component.html',
  styleUrls: ['./edit-presentation-view.component.scss']
})
export class EditPresentationViewComponent implements OnInit {
  presentationId: any;
  loading: boolean = true;

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.presentationId = this._route.snapshot.paramMap.get('id');
    this.loading = false;
  }

}
