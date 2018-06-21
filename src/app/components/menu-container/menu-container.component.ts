import { Component, OnInit } from '@angular/core';
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { Character } from '../../interfaces/Character';
import { Observable } from "rxjs";

@Component({
    selector: 'app-menu-container',
    templateUrl: './menu-container.component.html',
    styleUrls: ['./menu-container.component.css']
})

export class MenuContainerComponent implements OnInit {

    constructor(
        private swService: StarwarsCharacterService
    ) { }
    characters$: Observable<Character[]>
    data: Character[];
 
    ngOnInit() {
        //this.swService.storeData(this.swService.apiUrl);
        /* this.swService.filteredDataSubject
            .subscribe(filteredData => this.data = filteredData); */
        this.characters$ = this.swService.getList(this.swService.apiCharUrl);
        this.characters$
            .subscribe(results => this.data = results)
    }


}
