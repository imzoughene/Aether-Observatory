import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ThemeService } from '../../../../libs/ui/shared/src/index';
import { CoreFacade, SettingsFacade } from '@aether/core';

describe('App theme system', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [SettingsFacade, CoreFacade],
    }).compileComponents();
  });

  it('should initialize the theme in the document and toggle it', () => {
    const themeService = TestBed.inject(ThemeService);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(themeService.theme()).toBe('light');

    themeService.toggleTheme();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(themeService.theme()).toBe('dark');
  });

  it('should expose the shared core facade state', () => {
    const settings = TestBed.inject(SettingsFacade);
    const core = TestBed.inject(CoreFacade);

    expect(settings.theme()).toBe('light');
    expect(core.theme()).toBe('light');
    expect(core.user()).toMatchObject({ name: 'Alex Morgan' });
    expect(core.user$).toBeDefined();
    expect(settings.profile$).toBeDefined();
  });
});
