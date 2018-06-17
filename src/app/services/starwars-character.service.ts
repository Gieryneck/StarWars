import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Data } from '../interfaces/Data';


@Injectable({
  providedIn: 'root'
})
export class StarwarsCharacterService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrlJson: string = "../../assets/response.json";
  //private apiUrl: Object = JSON.parse(this.apiUrlJson).results;

  public data: Character[];

  public selectedProfile: Character = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    birth_year: '19BBY',
    gender: 'male',
    species: [
      'https://swapi.co/api/species/1/'
    ],
    vehicles: [
      'https://swapi.co/api/vehicles/14/',
      'https://swapi.co/api/vehicles/30/'
    ],
    starships: [
      'https://swapi.co/api/starships/12/',
      'https://swapi.co/api/starships/22/'
    ],
    number_of_vehicles: 2,
  }; 

  getData(): Observable<Object> {
      return this.http.get<Object>(this.apiUrlJson);
  }

  storeData() {
      this.getData()
        .subscribe((response: Data) => {
            this.data = response.results;
            console.log(this.data);
        });
  }

  selectProfile(char: Character) {
    this.selectedProfile = char;
    console.log("selectProfile here", this.selectedProfile);
    this.sendProfile();
  }

  sendProfile(): Observable<Character> {
    console.log("sendProfile here", this.selectedProfile);
    return of(this.selectedProfile);
  }
}
