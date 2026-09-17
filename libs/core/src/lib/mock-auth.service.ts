import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from './settings.facade';

@Injectable({
  providedIn: 'root',
})
export class MockAuthService {
  private readonly defaultUser: UserProfile = {
    id: 'u-1001',
    name: 'Alex Morgan',
    email: 'alex.morgan@aether.io',
    role: 'Product Lead',
    avatar: 'AM',
    preferences: {
      theme: 'light',
    },
  };

  private readonly userSignal = signal<UserProfile>(this.defaultUser);
  readonly user = this.userSignal.asReadonly();
  readonly user$ = new BehaviorSubject<UserProfile>(this.defaultUser);

  login(user: Partial<UserProfile>): void {
    const nextUser = {
      ...this.userSignal(),
      ...user,
      preferences: {
        ...this.userSignal().preferences,
        ...(user.preferences ?? {}),
      },
    };

    this.userSignal.set(nextUser);
    this.user$.next(nextUser);
  }

  logout(): void {
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Guest',
      email: 'guest@aether.io',
      role: 'Visitor',
      avatar: 'G',
      preferences: {
        theme: 'light',
      },
    };

    this.userSignal.set(guestUser);
    this.user$.next(guestUser);
  }
}
