import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Character } from "../../interfaces/Character";
@Component({
    selector: 'app-menu-element',
    templateUrl: './menu-element.component.html',
    styleUrls: ['./menu-element.component.css']
})
export class MenuElementComponent implements OnInit {

    constructor() { }

    @Input() character: Character;


    @Output() chooseItem: EventEmitter<Character> =
        new EventEmitter<Character>();

    clickHandler(char: Character) {
        this.chooseItem.emit(char);
    }

    ngOnInit() {
    }

}
