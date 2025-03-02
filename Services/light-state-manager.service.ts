/**
 * This utility is part of my Angular utilities collection.
 *
 * Find more at: https://github.com/n1m4mz/Angular-Utilities
 *
 * Reusable across different projects.
 *
 * Created for maintaining and showcasing best practices.
 *
 * — n1m4mz (Thanks for checking it out!)
 */

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LightStore<T> {
  private state$: BehaviorSubject<T>;

  constructor(initialState: T, private syncWithLocalStorage = false) {
    const savedState = this.syncWithLocalStorage ? this.loadState() : null;
    this.state$ = new BehaviorSubject<T>(savedState || initialState);

    if (this.syncWithLocalStorage) {
      this.state$.subscribe(state => this.saveState(state));
    }
  }

  private loadState(): T | null {
    const state = localStorage.getItem('app_state');
    return state ? JSON.parse(state) : null;
  }

  private saveState(state: T): void {
    localStorage.setItem('app_state', JSON.stringify(state));
  }

  select<K extends keyof T>(key: K): Observable<T[K]> {
    return this.state$.pipe(map(state => state[key]));
  }

  getState(): T {
    return this.state$.getValue();
  }

  setState(newState: Partial<T>): void {
    this.state$.next({...this.getState(), ...newState});
  }
}
