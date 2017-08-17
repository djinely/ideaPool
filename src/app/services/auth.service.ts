import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {  
	API_ENDPOINT = "https://small-project-api.herokuapp.com";
	public token: string;
	public tokenExpiry;

	constructor (private http: Http, private _router: Router) {
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = localStorage.getItem('currentToken');
        this.tokenExpiry = JSON.parse(localStorage.getItem('currentTokenExpiry'));
	}

    login(params) { 
		return this.http.post(this.API_ENDPOINT + '/access-tokens', params).map((res:Response) => res.json());
	}

    logout() {
    	return this.http.delete(this.API_ENDPOINT + '/access-tokens', this.jwt()).subscribe(() => {
    		localStorage.removeItem('currentUser');
    		localStorage.removeItem('currentToken');
    		localStorage.removeItem('currentRefreshToken');
    		this._router.navigate(['/signin']);
    	});
    }

    refreshToken() {
    	return this.http.post(this.API_ENDPOINT + '/access-tokens/refresh', {refresh_token: localStorage.getItem('currentRefreshToken')}, this.jwt()).map((res:Response) => res.json());
    }

	private jwt() {
        // create authorization header with jwt token
        let currentToken = localStorage.getItem('currentToken');
        if (currentToken) {
            let headers = new Headers({ 'x-access-token': currentToken });
            return new RequestOptions({ headers: headers, body: {refresh_token: localStorage.getItem('currentRefreshToken')} });
        }
    }
}