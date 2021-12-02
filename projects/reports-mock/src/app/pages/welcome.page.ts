import {Component} from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh">
      <h1>Welcome to Report Mock</h1>
      <div><a routerLink="/report">Start Now</a></div>
      <div><a routerLink="/login">Login</a></div>
    </div>
  `
})

export class WelcomePage{

}
