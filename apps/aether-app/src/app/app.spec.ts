import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ThemeService } from '../../../../libs/ui/shared/src/index';

describe('App theme system', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
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
});
