import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Character } from "../../interfaces/Character";
import { StarwarsCharacterService } from "../../services/starwars-character.service";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

    constructor(
       private swService: StarwarsCharacterService
    ) { }

    // searchTerms = new Subject<string>();
    // characters$: Observable<Character[]>;

    ngOnInit() {
    }

    filterItems(term: string) {
        //term.trim();
        //if (term.length === 0) return; this cant be cause how else we return original data?
        this.swService.filterItems(term);
    }
}
