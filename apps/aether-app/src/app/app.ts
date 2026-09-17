import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent, ThemeService } from '../../../../libs/ui/shared/src/index';

@Component({
  imports: [RouterModule, IconComponent],
  selector: 'aether-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly isDark = this.themeService.isDark;
  protected readonly tokenSummary = computed(() => this.themeService.tokens());

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
