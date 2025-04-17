import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'u111685381_splendorart';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("isLoggedIn :"+this.authService.isLoggedIn())
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/']);
    // } else {
    //   this.router.navigate(['/authentication/login']);
    // }
  }
}
