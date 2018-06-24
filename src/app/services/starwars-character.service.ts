import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject, observable } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Species } from "../interfaces/Species";
import { Data } from '../interfaces/Data';
import { mergeMap } from 'rxjs/operators';
import { range, forkJoin } from 'rxjs';
import { map, filter, scan, concatMap, tap } from 'rxjs/operators';
import { flattenDeep, chain } from "lodash";


@Injectable({
    providedIn: 'root'
})

export class StarwarsCharacterService {

    private profileSubject = new Subject<Character>();
    profileSubject$ = this.profileSubject.asObservable();
 

    constructor(
        private http: HttpClient
    ) { }

    apiCharUrl: string = "https://swapi.co/api/people/";
    apiCharUrlNext: string;
    apiCharUrlPrevious: string;
    searchUrl: string = "https://swapi.co/api/people/?search=";

    //private apiUrl: Object = JSON.parse(this.apiUrlJson).results;

    //speciesData: Species[] = [];
    data: Character[] = [];
    filteredData: Character[];
    filteredDataSubject = new Subject<Character[]>();

    selectProfile(char: Character) {
        this.profileSubject.next(char);
    }

    getRequestUrl(keyword: string) : string {
        if (this.apiCharUrlNext && keyword === this.apiCharUrlNext) return `${this.apiCharUrl}${this.apiCharUrlNext}`;
        if (this.apiCharUrlPrevious && keyword === this.apiCharUrlPrevious) return `${this.apiCharUrl}${this.apiCharUrlPrevious}`;
        return keyword ? `${this.searchUrl}${keyword}` : this.apiCharUrl;
    }

    getNextUrl(url:string | null) {
        if (!url)  return this.apiCharUrlNext = null;
        this.apiCharUrlNext = url.substr(this.apiCharUrl.length); 
    }

    getPreviousUrl(url: string | null) {
        if (!url) return this.apiCharUrlPrevious = null;
        this.apiCharUrlPrevious = url.substr(this.apiCharUrl.length);
        console.log(this.apiCharUrlPrevious);
    }

    getNextPage() {
        this.getList(this.apiCharUrlNext);
    }

    getPreviousPage() {
        this.getList(this.apiCharUrlPrevious);
    }

    //glowna funkcja pobierajaca liste

    public getList(keyword?:string): Observable<any> {
        const url = this.getRequestUrl(keyword)
        console.log(url);

        return this.http.get<any>(url)
            .pipe(
                // tap(this.setNavigation.bind(this)),
                tap(response => {
                    this.getNextUrl(response.next);
                    this.getPreviousUrl(response.previous);
                }),
                // PRAWIE KAŻDY OPERATOR DOSTAJE OBSERVABLE I ZWRACA OBSERVABLE
                map(response => response.results), // dostajemy Observable<Characters[]>   
                concatMap( // tu mapujemy tylko 1 item, tę tablicę characters
                    characters => forkJoin(
                            ...this.getAllSpeciesUrls(characters) // uniquespeciesurl[]
                            .map(uniqueSpeciesUrl => {
                                //console.log(uniquespeciesurl);
                                return this.getSpeciesObject(uniqueSpeciesUrl) // zwroci observable<SpeciesObject> dla kazdego urla, forkJoin czeka az 
                                                                                // wszystkie responsy wróca   
                                /* The forkJoin() operator allows us to take a list of Observables and execute them in parallel. 
                                    Once every Observable in the list emits a value, the forkJoin will emit a single Observable value 
                                    containing a list of all the resolved values from the Observables in the list. */
                            }),

                    ),
                    
                    // ta fcja bedaca parametrem concatMap to results selector dla outer observable(emitujace Characters[])
                    // i inner observable (emitujace SpeciesObj[])
                    (characters, species) => {
                        console.log(characters)
                        return this.addSpecies(characters, species)
                    }
                )
            )
    }
    
    // dodaje gatunek
    addSpecies(characters, species) {
        return characters.map((character) => {
            const speciesName =
                character['species'] // dostajemy sie do klucza species kazdego obiektu character, ten klucz zawiera tablice z urlem do obiektu species 
                    .map(spec =>

                        species.find(speciesObj => speciesObj['url'] === spec)
                    );
            const starships = 
            character["starships"]
                .map(shipUrl => 
                    species.find(speciesObj => speciesObj["url"] === shipUrl)
                );

            return Object.assign(
                character,
                {
                    species: speciesName,
                    starships: starships
                }
            );
        });
    }

    // pobiera gatunek z API
    getSpeciesObject(speciesUrl: string): Observable<Species> {
        return this.http.get<Species>(speciesUrl);
    }

    getAllSpeciesUrls(characters): string[] {
        // chain pozwala na przepuszczenie danych przez kolejne operatory lodasha, 
        // tworzy lodashowy wrapper ktory musi byc na koncu zdjety przez value
        return chain(characters)
            .map(character => [character.species, character.starships]) // dla kazdego character w tablicy zwroc tylko arraya z url do species (api zwraca arraya z urlem w srodku)
            .flattenDeep() // pozbadz sie wewnetrznych arrayow, zwraca [url, url, url, url] 
            .uniq() // Creates a duplicate-free version of an array, link do kazdego species bedzie sie pojawial tylko raz
            .value();
    }

    

}
