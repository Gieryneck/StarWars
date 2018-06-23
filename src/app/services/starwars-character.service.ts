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

    /* profileSubject = new Subject<Character>();

    profileObs$ = this.profileSubject.pipe(  
        concatMap(character => 
            forkJoin(  // zwraca Observable<StarshipObj[]>
                character.starships.
                map(starship => {
                   return this.http.get<Object>(starship)
                })
            ),
            (character, shipObjArr) => {
                //console.log(shipObjArr)
                return this.assignShips(character, shipObjArr)
            }
        )
    )

    assignShips(character, shipObjArr) {
       character.starships.map((starship, i) => {
            let ship = {name: shipObjArr[i]["name"], model: shipObjArr[i]["model"]}
            character.starships[i] = ship;
            //console.log(character.starships)  
       })
       return character; 
    } */

    constructor(
        private http: HttpClient
    ) { }

    apiCharUrl: string = "https://swapi.co/api/people/";
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
        //this.profileSubject.next(char);
    }

    //glowna funkcja pobierajaca liste
    public getList(url): Observable<any> {
        return this.http.get<any>(url)
            .pipe(
                // tap(this.setNavigation.bind(this)),

                // PRAWIE KAŻDY OPERATOR DOSTAJE OBSERVABLE I ZWRACA OBSERVABLE
                map(response => response.results), // dostajemy Observable<Characters[]>   
                concatMap( // tu mapujemy tylko 1 item, tę tablicę characters
                    characters => forkJoin([
                        /* ... */this.getAllSpeciesUrls(characters) // uniquespeciesurl[]       
                            .map(uniqueSpeciesUrl => {
                                //console.log(uniquespeciesurl);
                                return this.getSpeciesObject(uniqueSpeciesUrl) // zwroci observable<SpeciesObject> dla kazdego urla, forkJoin czeka az 
                                // wszystkie responsy wróca   
                                /* 
                                    The forkJoin() operator allows us to take a list of Observables and execute them in parallel. 
                                    Once every Observable in the list emits a value, the forkJoin will emit a single Observable value 
                                    containing a list of all the resolved values from the Observables in the list. */
                            }),
                            this.getAllStarshipsUrls(characters) // StarshipsUrls[]
                            .map(starshipUrl => {
                                return this.getSpeciesObject(starshipUrl)
                            })
                    ]),
                    
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
                        
                        species.find(speciesObj => speciesObj['url'] === spec)['name']
                    );
            /* const starships = []
            character["starships"]
                .map(shipUrl => {
                    starships.push(species.find(speciesObj => speciesObj["starships"].indexOf(shipUrl) !== -1)["name"]);
                    console.log(starships)
                }); */
            return Object.assign(
                character,
                {
                    species: speciesName,
                    //starships: starships
                }
            );
        });
    }

    // pobiera gatunek z API
    getSpeciesObject(speciesUrl: string): Observable<Object> {
        return this.http.get<Object>(speciesUrl);
    }

    getAllSpeciesUrls(characters): string[] {
        // chain pozwala na przepuszczenie danych przez kolejne operatory lodasha, 
        // tworzy lodashowy wrapper ktory musi byc na koncu zdjety przez value
        return chain(characters)
            .map(character => character.species) // dla kazdego character w tablicy zwroc tylko arraya z url do species (api zwraca arraya z urlem w srodku)
            .flattenDeep() // pozbadz sie wewnetrznych arrayow, zwraca [url, url, url, url] 
            .uniq() // Creates a duplicate-free version of an array, link do kazdego species bedzie sie pojawial tylko raz
            .value();
    }

    getAllStarshipsUrls(characters): string[] {
        // chain pozwala na przepuszczenie danych przez kolejne operatory lodasha, 
        // tworzy lodashowy wrapper ktory musi byc na koncu zdjety przez value
        return chain(characters)
            .map(character => character.starships) // dla kazdego character w tablicy zwroc tylko arraya z url do species (api zwraca arraya z urlem w srodku)
            .flattenDeep() // pozbadz sie wewnetrznych arrayow, zwraca [url, url, url, url] 
            .uniq() // Creates a duplicate-free version of an array, link do kazdego species bedzie sie pojawial tylko raz
            .value();
    }

}
