import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Character } from "../../interfaces/Character";
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
    @Output() keywordEntered: EventEmitter<string> = new EventEmitter<string>();

    keywordSubject = new Subject<string>();
    
    constructor() { }

    ngOnInit() {
        this.keywordSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(keyword => this.keywordEntered.emit(keyword))
    }

    search(term) {
        this.keywordSubject.next(term)
    }
}
