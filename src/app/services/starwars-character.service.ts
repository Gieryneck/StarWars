import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, Subject } from 'rxjs';
import { Character } from '../interfaces/Character';
import { Data } from '../interfaces/Data';


@Injectable({
    providedIn: 'root'
})
export class StarwarsCharacterService {

    profileSubject = new Subject<Character>();
    // profileObs$ = this.profileObs;

    searchTerms = new Subject<string>();
    
    constructor(
        private http: HttpClient
    ) { }

    private apiUrlJson: string = "../../assets/response.json";
    //private apiUrl: Object = JSON.parse(this.apiUrlJson).results;

    data: Character[];
    filteredData: Character[];

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

    //public selectedProfile: Character;

    selectProfile(char: Character) {
        /* this.selectedProfile = char;
        console.log("selectProfile here", this.selectedProfile); */
        this.profileSubject.next(char);
    }

    filterItems(term: string) {
        this.filteredData = this.data.filter((char: Character) => char.name.toLowerCase().indexOf(term) !== -1);
        console.log(this.filteredData);
        //this.searchTerms.next(term);
    }
}
