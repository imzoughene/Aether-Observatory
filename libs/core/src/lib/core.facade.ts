import { computed, inject, Injectable } from '@angular/core';
import { MockAuthService } from './mock-auth.service';
import { SettingsFacade, ThemeMode, UserProfile } from './settings.facade';

@Injectable({
  providedIn: 'root',
})
export class CoreFacade {
  private readonly settings = inject(SettingsFacade);
  private readonly auth = inject(MockAuthService);

  get theme() {
    return this.settings.theme;
  }

  get profile() {
    return this.settings.profile;
  }

  get profile$() {
    return this.settings.profile$;
  }

  get theme$() {
    return this.settings.theme$;
  }

  readonly user = computed(() => this.auth.user() ?? this.settings.profile());
  readonly isDark = computed(() => this.theme() === 'dark');
  readonly isAuthenticated = computed(() => Boolean(this.user().id && this.user().id !== 'guest'));
  readonly user$ = this.auth.user$;

  setTheme(mode: ThemeMode): void {
    this.settings.setTheme(mode);
  }

  toggleTheme(): void {
    this.settings.toggleTheme();
  }

  updateProfile(partial: Partial<UserProfile>): void {
    this.settings.updateProfile(partial);
    this.auth.login(partial);
  }

  signIn(user: Partial<UserProfile>): void {
    this.auth.login(user);
    this.settings.updateProfile(user);
  }

  signOut(): void {
    this.auth.logout();
    this.settings.updateProfile({
      id: 'guest',
      name: 'Guest',
      email: 'guest@aether.io',
      role: 'Visitor',
      avatar: 'G',
      preferences: {
        theme: this.settings.theme(),
      },
    });
  }
}
