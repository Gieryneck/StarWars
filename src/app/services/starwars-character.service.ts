import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Species } from '../interfaces/Species';
import { map, concatMap, tap } from 'rxjs/operators';
import { flattenDeep, chain, isEmpty } from 'lodash';
import {Starship} from '../interfaces/Starship';


@Injectable({
    providedIn: 'root'
})

export class StarwarsCharacterService {

    private profileSubject = new Subject<Character>();
    profileSubject$ = this.profileSubject.asObservable();


    constructor(
        private http: HttpClient
    ) {
        this.updateCurrentUrl();
    }

    apiCharEndpoint = 'https://swapi.co/api/people/';

    private currentUrl: string;
    private apiNextUrl: string;
    private apiPreviousUrl: string;

    keyword = '';

    selectProfile(char: Character) {
        this.profileSubject.next(char);
    }

    getRequestUrl(keyword: string): string {
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

    setNextUrl(url: string | null) {
        this.apiNextUrl = url;
    }

    setPreviousUrl(url: string | null) {
        this.apiPreviousUrl = url;
    }

    public getNextPage() {
        this.currentUrl = this.apiNextUrl;
        return this.getList();
    }

    public getPreviousPage() {
        this.currentUrl = this.apiPreviousUrl;
        return this.getList();
    }

    updateCurrentUrl() {
        this.currentUrl = this.getRequestUrl(this.keyword);
    }

    //glowna funkcja pobierajaca liste

    public getList(): Observable<Character[]> {

        return this.http.get<any>(this.currentUrl)

            .pipe(
                tap(response => {
                    this.setNextUrl(response.next);
                    this.setPreviousUrl(response.previous);
                }),
                map((response): Character[] => response.results),
                concatMap(
                    characters => forkJoin(
                        ...this.getAllNestedUrls(characters)
                            .map(uniqueUrl => {
                                return this.getNestedObject(uniqueUrl);
                            }),

                        ),
                    // ta fcja bedaca parametrem concatMap to results selector dla outer observable(result to Observable<Characters[]>)
                    // i inner observable (result to SpeciesObj[])
                    (characters, speciesAndStarships) => {
                        return this.addSpeciesAndStarships(characters, speciesAndStarships);
                    }
                )
            );
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

    // dodaje gatunek

    addSpeciesAndStarships(characters, data) {
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

    // pobiera gatunek z API
    getNestedObject(url: string): Observable<Species | Starship> {
        return this.http.get<Species | Starship>(url);
    }

    getAllNestedUrls(characters): string[] {
        // chain pozwala na przepuszczenie danych przez kolejne operatory lodasha,
        // tworzy lodashowy wrapper ktory musi byc na koncu zdjety przez value
        return chain(characters)
            .map(character => [character.species, character.starships]) // dla kazdego character w tablicy zwroc tylko arraya z url do species (api zwraca arraya z urlem w srodku)
            .flattenDeep() // pozbadz sie wewnetrznych arrayow, zwraca [url, url, url, url]
            .uniq() // Creates a duplicate-free version of an array, link do kazdego species bedzie sie pojawial tylko raz
            .value();
    }
}
