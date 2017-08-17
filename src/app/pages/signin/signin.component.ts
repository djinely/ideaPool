import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [UserService, AuthService]
})
export class SigninComponent implements OnInit {

	public signInForm: FormGroup;
    public submitted: boolean;
    public error: string = '';
    returnUrl: string;

  	constructor(private _authService: AuthService, private _userService: UserService, private _router: Router, private _route: ActivatedRoute) { }

  	ngOnInit() {
  		let emailRegEx = /\S+@\S+\.\S+/;
  		let passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

	  	this.signInForm = new FormGroup({
	        email: new FormControl('', [<any>Validators.required, <any>Validators.minLength(2), <any>Validators.pattern(emailRegEx)]),
	        password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), <any>Validators.pattern(passwordRegEx)])
	    });

	    // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  	}

  	doLogIn() {
        let params = {
        	email: this.signInForm.controls.email.value,
        	password: this.signInForm.controls.password.value
        }

        this._authService.login(params).subscribe(
        	data => {
        		let token = data.jwt;
        		if (token) {
        			this._authService.token = token;
        			this._authService.tokenExpiry = new Date();
        			localStorage.setItem('currentToken', token);
        			localStorage.setItem('currentRefreshToken', data.refresh_token);
        			localStorage.setItem('currentTokenExpiry', JSON.stringify(this._authService.tokenExpiry));

        			// Get user info
        			this._userService.getUser().subscribe(data => {
        				this._userService.user = data;
        				localStorage.setItem('currentUser', JSON.stringify(data));

        				this._router.navigate([this.returnUrl]);
        			});
        		}
        	},
        	err => { this.error = err.json().reason; }
        );
  	}

}
