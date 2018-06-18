import { Component, OnInit } from '@angular/core';
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { Character } from '../../interfaces/Character';


@Component({
    selector: 'app-menu-container',
    templateUrl: './menu-container.component.html',
    styleUrls: ['./menu-container.component.css']
})

export class MenuContainerComponent implements OnInit {

    constructor(
        private swService: StarwarsCharacterService
    ) { }

    term: string;

    ngOnInit() {
        this.swService.storeData();
        /* this.swService.searchTerms
            .subscribe(term => this.term = term); */
    }


}
