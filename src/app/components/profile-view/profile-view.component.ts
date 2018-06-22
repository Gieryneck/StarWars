import { Component, OnInit, OnChanges } from '@angular/core';
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { Character } from "../../interfaces/Character";
import { Observable } from 'rxjs';

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

    constructor (
        private swService: StarwarsCharacterService
    ) { }

    profile$:  Observable<Character>;

    ngOnInit(): void {
        this.profile$ = this.swService.profileSubject$
    }

    ngOnChanges() {
    }
}
