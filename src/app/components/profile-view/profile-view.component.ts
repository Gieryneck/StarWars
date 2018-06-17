import { Component, OnInit, OnChanges } from '@angular/core';
import { StarwarsCharacterService } from "../../services/starwars-character.service";
import { Character } from "../../interfaces/Character";

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  constructor(
    private swService: StarwarsCharacterService
  ) {}

  profile: Character | null | undefined/*  = this.swService.selectedProfile */;

   getProfile(): void {
      this.swService.sendProfile()
        .subscribe(profile => {
            this.profile = profile;
            console.log(this.profile);
        });
  } 

  ngOnInit() {
      this.getProfile();
  }

  ngOnChanges() {
  }
}
