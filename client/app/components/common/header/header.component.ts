import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Settings } from '../../../app.settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() navMenuToggle = new EventEmitter<string>();
  // general app settings, for title and credit info
  settings = Settings;

  constructor(
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Navigates router to specified path
   * 
   * @param path - URL of desired route
   */
  navigate(path: string) {
    this._router.navigate([path]);
  }

  /**
   * Calls event emitter to signal when nav men button was toggled
   */
  toggleNav() {
    this.navMenuToggle.emit();
  }

}
