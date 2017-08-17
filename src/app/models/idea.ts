export class Idea {
	id: string;
    content: string;
    impact;
    ease;
    confidence;
    isNew: boolean;

    constructor() {
    	this.id = '';
    	this.content = '';
    	this.impact = 1;
    	this.ease = 1;
    	this.confidence = 1;
    	this.isNew = false;
    }

    initWithData(id, content, impact, ease, confidence) {
    	this.id = id;
    	this.content = content;
    	this.impact = impact;
    	this.ease = ease;
    	this.confidence = confidence;
    	this.isNew = false;
    }

    getAvg() {
    	return (Number(this.impact) + Number(this.ease) + Number(this.confidence)) / 3;
    }
}