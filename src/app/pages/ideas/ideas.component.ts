import { Component, OnInit } from '@angular/core';

import { IdeasService } from '../../services/ideas.service';
import { AuthService } from '../../services/auth.service';

import { Idea } from '../../models/idea';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css'],
  providers: [IdeasService, AuthService]
})
export class IdeasComponent implements OnInit {
	currentPage = 1;
	ideas: Array<Idea> = [];
	isAdding = false;
	originalIdeas = [];
	nextAvaliable = false;

	constructor(private _ideasService:IdeasService, private _authService:AuthService) { }

	ngOnInit() {
		this.loadIdeas(this.currentPage);
	}

	loadIdeas(page) {
		this.currentPage = page;

		let getIdeas = () => {
			this._ideasService.getIdeas(page).subscribe(
	        	data => {
	        		this.ideas = data;

	        		// Check next page availability
	        		this._ideasService.getIdeas(page+1).subscribe( data => { this.nextAvaliable = data.length > 0; });
	        	}
	        );
		}

		if (!this._authService.isTokenValid()) {
			this._authService.refreshToken(getIdeas);
		} else {
			getIdeas();
		}
	}

	addNewLine() {
		if (!this.isAdding) {
			let newIdea = new Idea();
			newIdea.isNew = true;
			this.ideas.unshift(newIdea);
			this.isAdding = true;
		}
	}

	edit(idea) {
		idea.isNew = true;
		this.originalIdeas[idea.id] = Object.assign({}, idea);
	}

	save(idea) {
		let saveIdea = () => {
			this._ideasService.save(idea).subscribe(data => {
				this.loadIdeas(this.currentPage);
			});
		}

		if (!this._authService.isTokenValid()) {
			this._authService.refreshToken(saveIdea);
		} else {
			saveIdea();
		}
		
		if (idea.id == '') {
			this.isAdding = false;
		}
	}

	delete(idea) {
		let confirmDialog = confirm("This idea will be permanently deleted.");
		if (confirmDialog == true) {
			let deleteIdea = () => {
				this._ideasService.delete(idea).subscribe(() => {
					this.loadIdeas(this.currentPage);
				});
			}

			if (!this._authService.isTokenValid()) {
				this._authService.refreshToken(deleteIdea);
			} else {
				deleteIdea();
			}
		}
	}

	cancelEdit(idea) {
		if (idea.id == '') {
			this.ideas.shift();
			this.isAdding = false;
		} else {
			idea.isNew = false;
			idea.id = this.originalIdeas[idea.id].id;
			idea.content = this.originalIdeas[idea.id].content;
			idea.impact = this.originalIdeas[idea.id].impact;
			idea.ease = this.originalIdeas[idea.id].ease;
			idea.confidence = this.originalIdeas[idea.id].confidence;
		}
	}

}
