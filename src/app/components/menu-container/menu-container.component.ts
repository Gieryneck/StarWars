import { Component, OnInit } from '@angular/core';
import { StarwarsCharacterService } from '../../services/starwars-character.service';
import { Character } from '../../interfaces/Character';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-menu-container',
    templateUrl: './menu-container.component.html',
    styleUrls: ['./menu-container.component.css']
})

export class MenuContainerComponent implements OnInit {
    characters$: Observable<Character[]>;

    constructor(
        private swService: StarwarsCharacterService
    ) { }

    ngOnInit() {
        this.characters$ = this.swService.getList();
    }

    search(keyword: string) {
        this.swService.setKeyword(keyword);
        this.characters$ = this.swService.getList();
    }

    getNextPage() {
        this.characters$ = this.swService.getNextPage();
    }

    getPreviousPage() {
        this.characters$ = this.swService.getPreviousPage();
    }
}
