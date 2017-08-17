import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {  
	API_ENDPOINT = "https://small-project-api.herokuapp.com";
	user;

	constructor (private http: Http) {
		let loggedUser = JSON.parse(localStorage.getItem('currentUser'));
		if (loggedUser) {
		    this.user = loggedUser;
		}
	}

	getUser() {
		return this.http.get(this.API_ENDPOINT + '/me', this.jwt()).map((res:Response) => res.json());
	}

    create(params) { 
		return this.http.post(this.API_ENDPOINT + '/users', params).map((res:Response) => res.json());
    }

    private jwt() {
        // create authorization header with jwt token
        let currentToken = localStorage.getItem('currentToken');
        if (currentToken) {
            let headers = new Headers({ 'x-access-token': currentToken });
            return new RequestOptions({ headers: headers });
        }
    }
}