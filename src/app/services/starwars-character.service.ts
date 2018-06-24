import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Species } from '../interfaces/Species';
import { map, concatMap, tap } from 'rxjs/operators';
import { flattenDeep, chain, isEmpty } from 'lodash';
import {Starship} from '../interfaces/Starship';
import { Data } from '../interfaces/Data';

@Injectable({
    providedIn: 'root'
})

export class StarwarsCharacterService {

    constructor(
        private http: HttpClient
    ) {
        this.updateCurrentUrl();
    }

    private profileSubject = new Subject<Character>();
    public profileSubject$ = this.profileSubject.asObservable();

    private apiCharEndpoint = 'https://swapi.co/api/people/';
    private currentUrl: string;
    private apiNextUrl: string;
    private apiPreviousUrl: string;
    private keyword = '';

    
    public selectProfile(char: Character) {
        this.profileSubject.next(char);
    }

    public setKeyword(keyword: string) {
        this.keyword = keyword;
        this.updateCurrentUrl();
    }

    public isNextPage() {
        return this.apiNextUrl !== null;
    }

    public isPreviousPage() {
        return this.apiPreviousUrl !== null;
    }

    public getNextPage() {
        this.currentUrl = this.apiNextUrl;
        return this.getList();
    }

    public getPreviousPage() {
        this.currentUrl = this.apiPreviousUrl;
        return this.getList();
    }

    public getList(): Observable<Character[]> {

        return this.http.get<any>(this.currentUrl)
            .pipe(
                tap((response: Data) => {
                    this.setNextUrl(response.next);
                    this.setPreviousUrl(response.previous);
                    console.log(this.currentUrl);
                }),
                map((response): Character[] => response.results),
                concatMap(
                    characters => forkJoin(
                        ...this.getAllNestedUrls(characters)
                            .map(uniqueUrl => {
                                return this.getNestedObject(uniqueUrl);
                            }),

                        ),
                    // ta fcja bedaca parametrem concatMap to results selector dla danych emitowanych
                    // przez outer observable(characters)
                    // i inner observable (speciesAndStarships)
                    (characters: Character[], speciesAndStarships: Array<Species | Starship> ) => {
                        return this.addSpeciesAndStarships(characters, speciesAndStarships);
                    }
                )
            );
    }


    private getRequestUrl(keyword: string): string {
        let url = this.apiCharEndpoint;
        const params = {};

        if (keyword) {
            params['search'] = keyword;
        }

        url += this.generateQueryString(params);

        return url;
    }

    private generateQueryString(params: {}) {

        let querystring = '';

        if (!isEmpty(params)) {
            querystring += '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
        }

        return querystring;
    }

    private setNextUrl(url: string | null) {
        this.apiNextUrl = url;
    }

    private setPreviousUrl(url: string | null) {
        this.apiPreviousUrl = url;
    }

    private updateCurrentUrl() {
        this.currentUrl = this.getRequestUrl(this.keyword);
    }

    private addSpeciesAndStarships(characters, data): Character[] {
        return characters.map((character) => ({
            ...character,
            species: character.species
                .map(spec =>
                    data.find(speciesObj => speciesObj['url'] === spec)
                ),
            starships: character.starships
                .map(shipUrl =>
                    data.find(speciesObj => speciesObj['url'] === shipUrl)
                ),
        }));
    }

    
    private getNestedObject(url: string): Observable<Species | Starship> {
        return this.http.get<Species | Starship>(url);
    }

    private getAllNestedUrls(characters): string[] {
        // chain pozwala na przepuszczenie danych przez kolejne operatory lodasha,
        // tworzy lodashowy wrapper ktory musi byc na koncu zdjety przez value
        return chain(characters)
            .map(character => [character.species, character.starships]) // dla kazdego character w tablicy zwroc tylko arraya z url do species (api zwraca arraya z urlem w srodku)
            .flattenDeep() // pozbadz sie wewnetrznych arrayow, zwraca [url, url, url, url]
            .uniq() // Creates a duplicate-free version of an array, link do kazdego species bedzie sie pojawial tylko raz
            .value();
    }
}
