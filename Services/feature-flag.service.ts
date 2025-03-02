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

import {Injectable, Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FeatureFlagService {
  private flagsSubject = new BehaviorSubject<Record<string, boolean>>({});
  flags$ = this.flagsSubject.asObservable();
  private stateName = 'featureFlags';

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  private loadFlags() {
    const localFlags = JSON.parse(localStorage.getItem(this.stateName) || '{}');
    this.flagsSubject.next(localFlags);
  }

  isFeatureEnabled(flag: string): boolean {
    return !!this.flagsSubject.getValue()[flag];
  }

  setFeatureFlag(flag: string, value: boolean) {
    const updatedFlags = {...this.flagsSubject.getValue(), [flag]: value};
    this.flagsSubject.next(updatedFlags);
    localStorage.setItem(this.stateName, JSON.stringify(updatedFlags));
  }
}

@Directive({selector: '[appFeatureFlag]'})
export class FeatureFlagDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {
  }

  @Input() set appFeatureFlag(flag: string) {
    if (this.featureFlagService.isFeatureEnabled(flag)) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

