import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;

  constructor(private route: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.route.navigate(['/members']);
    }
  }

  setRegisterMode(): void {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean): void {
    this.registerMode = registerMode;
  }
}
