import { Injectable, computed, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'aether-theme';
  private readonly themeSignal = signal<ThemeMode>(this.resolveInitialTheme());

  readonly theme = this.themeSignal.asReadonly();
  readonly isDark = computed(() => this.themeSignal() === 'dark');
  readonly tokens = computed(() => ({
    background: this.isDark() ? '#020817' : '#f8fafc',
    surface: this.isDark() ? '#0f172a' : '#ffffff',
    surfaceAlt: this.isDark() ? '#111827' : '#e2e8f0',
    primary: '#2563eb',
    text: this.isDark() ? '#e2e8f0' : '#0f172a',
    textMuted: this.isDark() ? '#94a3b8' : '#475569',
    border: this.isDark() ? '#334155' : '#cbd5e1',
  }));

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  setTheme(mode: ThemeMode): void {
    const nextTheme = mode === 'dark' ? 'dark' : 'light';
    this.themeSignal.set(nextTheme);
    this.persistTheme(nextTheme);
    this.applyTheme(nextTheme);
  }

  toggleTheme(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  private resolveInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem(this.storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    const mediaQuery = typeof window.matchMedia === 'function'
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
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }
}
