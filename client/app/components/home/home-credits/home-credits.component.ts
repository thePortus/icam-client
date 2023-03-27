import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-credits',
  templateUrl: './home-credits.component.html',
  styleUrls: ['./home-credits.component.scss']
})
export class HomeCreditsComponent implements OnInit {
  // bio images, from assets
  imgs = {
    davidjthomas: '/assets/images/davidjthomas.jpg',
    mattking: '/assets/images/mattking.jpg'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
