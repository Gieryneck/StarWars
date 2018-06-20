import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Species } from "../interfaces/Species";
import { Data } from '../interfaces/Data';
import { mergeMap } from 'rxjs/operators';
import { range, forkJoin } from 'rxjs';
import { map, filter, scan, concatMap } from 'rxjs/operators';
import { flattenDeep, chain } from "lodash";


@Injectable({
    providedIn: 'root'
})

export class StarwarsCharacterService {

    profileSubject = new Subject<Character>();
    // profileObs$ = this.profileObs;

    constructor(
        private http: HttpClient
    ) { }

    apiUrl: string = "https://swapi.co/api/people/";
    //private apiUrl: Object = JSON.parse(this.apiUrlJson).results;

    //speciesData: Species[] = [];
    data: Character[] = [];
    filteredData: Character[];
    filteredDataSubject = new Subject<Character[]>();

    /* getData(url: string): Observable<Object> {
        return this.http.get<Object>(url);
    }

    storeData(url: string) {
        this.getData(url)
            .subscribe((response: Data) => {
                if (response.next) {
                    let next = response.next;
                    //this.storeData(next);
                }
                this.data.push.apply(this.data, response.results);
                //console.log(this.data);
            });
    } */

    selectProfile(char: Character) {
        this.profileSubject.next(char);
    }

    //glowna funkcja pobierajaca liste
    public getList(): Observable<any> {
        return this.http.get<any>('https://swapi.co/api/people/')
            .pipe(
                // tap(this.setNavigation.bind(this)),
                map(response => response.results),
                concatMap(
                    characters => forkJoin(
                        ...this.getSpecies(characters)
                            .map(species => {
                                return this.getSpeciesUrl(species)
                            })
                    ),
                    (characters, species) => {
                        return this.addSpecies(characters, species)
                    }
                )
            )
    }

    // dodaje gatunek
  addSpecies(characters, species) {
    return characters.map((character) => {
      const speciesList =
        character['species']
          .map(spec =>
            species.find(spec1 => spec1['url'] === spec)['name']
          );
      return Object.assign(
        character,
        { species: speciesList }
      );
    });
  }

  // pobiera gatunek z API
  getSpeciesUrl(speciesUrl: string): Observable<string> {
    return this.http.get<string>(speciesUrl);
  }


  getSpecies(characters): string[] {
    return chain(characters)
   .map(character => character.species)
   .flattenDeep()
   .uniq()
   .value();
}
}
