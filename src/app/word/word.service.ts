import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private checkUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/'; // API URL
  private getUrl = 'https://random-word-api.herokuapp.com/word'; // API URL

  constructor(private http: HttpClient) { }

  checkWord(word: string): Observable<boolean> {
    return this.http.get<any>(`${this.checkUrl}${word}`).pipe(
      map(response => !response.title), // If 'title' field is present, the word doesn't exist
      catchError(() => of(false)) // If there's an error, return false
    );
  }


  getWord(length: number): Observable<string> {
    //console.log(`${this.getUrl}?length=${length}`);
    return this.http.get<string[]>(`${this.getUrl}?length=${length}`).pipe(
      map(response => response[0]), // Extract the first word from the array
      catchError(() => of('error')) // If there's an error, return 'error'
    );
  }
}
