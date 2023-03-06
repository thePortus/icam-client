import { Component, OnInit } from '@angular/core';

import { Settings } from '../../../app.settings';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  // app settings
  settings = Settings;
  
  constructor() { }

  ngOnInit(): void {
  }

}
