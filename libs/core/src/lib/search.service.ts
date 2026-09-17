import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly querySubject = new Subject<string>();

  readonly query$: Observable<string> = this.querySubject.pipe(
    map((query) => query.trim()),
    debounceTime(150),
    distinctUntilChanged(),
    startWith(''),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  setQuery(query: string): void {
    this.querySubject.next(query);
  }
}
