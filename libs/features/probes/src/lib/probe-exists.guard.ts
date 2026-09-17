import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ProbesService } from '@aether/data-services';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProbeExistsGuard implements CanActivate {
  private readonly probesService = inject(ProbesService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const id = route.paramMap.get('id');
    if (!id) {
      return of(this.router.createUrlTree(['/404']));
    }

    return this.probesService.getById(id).pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/404'])))
    );
  }
}
