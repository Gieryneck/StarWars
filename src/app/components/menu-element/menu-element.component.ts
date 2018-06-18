import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Character } from "../../interfaces/Character";
import { StarwarsCharacterService } from "../../services/starwars-character.service";

@Component({
    selector: 'app-menu-element',
    templateUrl: './menu-element.component.html',
    styleUrls: ['./menu-element.component.css']
})
export class MenuElementComponent implements OnInit {

    constructor(
        private swService: StarwarsCharacterService
    ) { }

    @Input() character: Character;

    clickHandler(char: Character) {
        this.swService.selectProfile(char)
    } 

    ngOnInit() {
    }

}
