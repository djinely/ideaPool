import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [UserService, AuthService]
})
export class MenuComponent implements OnInit {
	user;

	constructor(private _userService:UserService, private _authService:AuthService) {
		this.user = this._userService.user;
	}

	ngOnInit() { }

	logoutClicked() {
		this.user = null;
		this._authService.logout();
	}

}
