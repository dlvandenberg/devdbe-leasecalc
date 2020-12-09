import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CalculateService, Result } from '../services/calculate.service';

@Injectable({
    providedIn: 'root'
})
export class ResultResolver implements Resolve<Result> {
    constructor(private readonly calculateService: CalculateService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Result | Observable<Result> | Promise<Result> {
        return this.calculateService.result$.pipe(take(1));
    }
}
