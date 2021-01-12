import {Component} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <h1>Welcome to Report Mock</h1>
    <div><a routerLink="/report">Start Now</a></div>
    <div><a routerLink="/login">Login</a></div>
  `
})

export class WelcomePage{

}
