import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  preferences: {
    theme: ThemeMode;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly storageKey = 'aether-theme';
  private readonly profileSubject = new BehaviorSubject<UserProfile>(
    this.createProfile(this.resolveInitialTheme())
  );
  private readonly themeSubject = new BehaviorSubject<ThemeMode>(this.resolveInitialTheme());

  readonly theme = signal<ThemeMode>(this.resolveInitialTheme());
  readonly profile = signal<UserProfile>(this.createProfile(this.resolveInitialTheme()));
  readonly profile$ = this.profileSubject.asObservable();
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    const initialTheme = this.resolveInitialTheme();
    this.theme.set(initialTheme);
    this.themeSubject.next(initialTheme);
    const initialProfile = this.createProfile(initialTheme);
    this.profile.set(initialProfile);
    this.profileSubject.next(initialProfile);
    this.applyTheme(initialTheme);
  }

  setTheme(mode: ThemeMode): void {
    const nextTheme: ThemeMode = mode === 'dark' ? 'dark' : 'light';
    this.theme.set(nextTheme);
    this.themeSubject.next(nextTheme);
    this.profile.update((current: UserProfile) => {
      const nextProfile: UserProfile = {
        ...current,
        preferences: {
          ...current.preferences,
          theme: nextTheme,
        },
      };

      this.profileSubject.next(nextProfile);
      return nextProfile;
    });

    this.persistTheme(nextTheme);
    this.applyTheme(nextTheme);
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  updateProfile(partial: Partial<UserProfile>): void {
    this.profile.update((current: UserProfile) => {
      const nextProfile: UserProfile = {
        ...current,
        ...partial,
        preferences: {
          ...current.preferences,
          ...(partial.preferences ?? {}),
        },
      };

      this.profileSubject.next(nextProfile);
      return nextProfile;
    });
  }

  private createProfile(theme: ThemeMode): UserProfile {
    return {
      id: 'u-1001',
      name: 'Alex Morgan',
      email: 'alex.morgan@aether.io',
      role: 'Product Lead',
      avatar: 'AM',
      preferences: {
        theme,
      },
    };
  }

  private resolveInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem(this.storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    return mediaQuery?.matches ? 'dark' : 'light';
  }

  private persistTheme(theme: ThemeMode): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, theme);
    }
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade {
  private readonly service: SettingsService;

  constructor(service: SettingsService) {
    this.service = service;
  }

  get theme() {
    return this.service.theme;
  }

  get profile() {
    return this.service.profile;
  }

  get profile$() {
    return this.service.profile$;
  }

  get theme$() {
    return this.service.theme$;
  }

  setTheme(mode: ThemeMode): void {
    this.service.setTheme(mode);
  }

  toggleTheme(): void {
    this.service.toggleTheme();
  }

  updateProfile(partial: Partial<UserProfile>): void {
    this.service.updateProfile(partial);
  }
}
