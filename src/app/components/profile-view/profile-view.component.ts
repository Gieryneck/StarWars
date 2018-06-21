import { Component, OnInit, OnChanges } from '@angular/core';
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { Character } from "../../interfaces/Character";

@Component({
    selector: 'app-profile-view',
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

    constructor (
        private swService: StarwarsCharacterService
    ) { }

    profile: Character | null | undefined;

    ngOnInit(): void {
        /* this.swService.profileObs$
            .subscribe(character => {
                this.profile = character;
            }); */
    }

    ngOnChanges() {
    }
}
