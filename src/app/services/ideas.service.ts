import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from './auth.service';

import { Idea } from '../models/idea';

@Injectable()
export class IdeasService {  
	API_ENDPOINT = "https://small-project-api.herokuapp.com";

	constructor (private http: Http, private _router: Router, private _authService:AuthService) { }

    getIdeas(page): Observable<Idea[]> {
        return this.http.get(this.API_ENDPOINT + '/ideas' + '?page=' + page, this.jwt())
            .map((res:Response) => res.json().map((obj) => {
                let idea = new Idea();
                idea.initWithData(obj.id, obj.content, obj.impact, obj.ease, obj.confidence);
                return idea;
            }));
	}

    save(idea) {
        let endPoint = this.API_ENDPOINT + '/ideas';
        if (idea.id != '') {
            endPoint = endPoint + '/' + idea.id;
        }

        if (idea.id == '') {
            return this.http.post(endPoint, idea, this.jwt()).map((res:Response) => res.json());
        } else {
            return this.http.put(endPoint, idea, this.jwt()).map((res:Response) => res.json());
        }
    }

    delete(idea) {
        return this.http.delete(this.API_ENDPOINT + '/ideas/' + idea.id, this.jwt());
    }

	private jwt() {
        // create authorization header with jwt token
        let currentToken = this._authService.token;
        if (currentToken) {
            let headers = new Headers({ 'x-access-token': currentToken });
            return new RequestOptions({ headers: headers });
        }
    }
}