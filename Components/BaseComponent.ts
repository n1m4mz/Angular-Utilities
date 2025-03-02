/**
 * This utility is part of my Angular utilities collection.
 *
 * Find more at: https://github.com/n1m4mz/Angular-Utilities
 *
 * Reusable across different projects.
 *
 * Created for maintaining and showcasing best practices.
 *
 * Extend this component in your own components
 * to automatically handle loading states, errors, and unsubscriptions.
 *
 * — n1m4mz (Thanks for checking it out!)
 */

import {Directive, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, Observable, of, throwError} from 'rxjs';
import { takeUntil, debounceTime, finalize, catchError, throttleTime, retry, delay, map } from 'rxjs/operators';

@Directive({ standalone: true }) // This prevents Angular from complaining
export class BaseComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private errorSubject$ = new Subject<string>();
  public isLoading$ = new BehaviorSubject<boolean>(false);

  protected setLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }

  protected handleError(error: any) {
    this.errorSubject$.next(error.message || 'Unknown error');
  }

  // Just call it in your pipe to unsubscribe the obs
  protected takeUntilDestroy<T>() {
    return (source: Observable<T>) => source.pipe(takeUntil(this.destroy$));
  }


  protected handleObservable<T>(obs: Observable<T>): Observable<T> {
    this.setLoading(true);
    return obs.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.setLoading(false)),
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
