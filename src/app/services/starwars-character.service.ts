import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Data } from '../interfaces/Data';
import { mergeMap } from 'rxjs/operators';
import { range } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
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

    getData(url: string): Observable<Object> {
        return this.http.get<Object>(url);
    } 

    getSpecies(url: string) {
        return this.http.get<Object>(url);
    }

    storeData(url: string) {
        this.getData(url)
            .subscribe((response: Data) => {
                if (response.next) {
                    let next = response.next;
                    this.storeData(next);
                }
                this.data.push.apply(this.data, response.results);
                this.filterItems("");
                //console.log(this.data);
            });
    }

    selectProfile(char: Character) {
        this.profileSubject.next(char);
    }

    filterItems(term: string) {
        this.filteredData = this.data.filter((char: Character) => char.name.toLowerCase().indexOf(term) !== -1);
        // console.log(this.filteredData);
        this.filteredDataSubject.next(this.filteredData);
    }
}
