import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService, AuthService]
})
export class SignupComponent implements OnInit {

	public signUpForm: FormGroup;
    public submitted: boolean;
    public error: string = '';

  	constructor(private _userService: UserService, private _authService:AuthService, private _router: Router) { }

	ngOnInit() {
		let emailRegEx = /\S+@\S+\.\S+/;
  		let passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

		this.signUpForm = new FormGroup({
			name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(2)]),
	        email: new FormControl('', [<any>Validators.required, <any>Validators.minLength(2), <any>Validators.pattern(emailRegEx)]),
	        password: new FormControl('', [<any>Validators.required, <any>Validators.minLength(8), <any>Validators.pattern(passwordRegEx)])
	    });
	}

	doSignUp() {
        let params = {
        	name: this.signUpForm.controls.name.value,
        	email: this.signUpForm.controls.email.value,
        	password: this.signUpForm.controls.password.value
        }

        this._userService.create(params).subscribe(
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

        				this._router.navigate(['/']);
        			});
        		}
        	},
        	err => { this.error = err.json().reason; }
        );
  	}

}
