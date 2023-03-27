import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  title = 'icam';
  // status of site nav menu
  navMenuToggled: boolean = false;

  /**
   * Executed by header component event emitter, toggles nav menu status
   */
  toggleNavMenu() {
    this.navMenuToggled = !this.navMenuToggled;
    if (this.navMenuToggled) {
      this.sidenav.open();
    }
    else {
      this.sidenav.close();
      
    }
  }
}
