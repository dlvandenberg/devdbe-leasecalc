import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first, tap } from 'rxjs/operators';

@Injectable()
export class AppUpdateService {

  constructor(
    private readonly appRef: ApplicationRef,
    private readonly updates: SwUpdate
  ) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.pipe(tap(() => console.log('Checking for updates'))).subscribe(() => updates.checkForUpdate());

    updates.available.subscribe(() => {
      if (confirm('A new version of the application is avalaible, would you like to update?')) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }
}
