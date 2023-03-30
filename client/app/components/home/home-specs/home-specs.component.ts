import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Specs } from './specs';

@Component({
  selector: 'app-home-specs',
  templateUrl: './home-specs.component.html',
  styleUrls: ['./home-specs.component.scss']
})
export class HomeSpecsComponent implements OnInit {
  specs = Specs;
  
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
