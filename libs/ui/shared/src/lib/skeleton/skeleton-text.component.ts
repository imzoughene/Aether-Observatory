import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';

export interface SkeletonTextLineConfig {
  width?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

@Component({
  selector: 'aether-skeleton-text',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skeleton-text.component.html',
  styleUrls: ['./skeleton-text.component.scss'],
})
export class SkeletonTextComponent {
  @Input() lines = 3;
  @Input() lineConfig: SkeletonTextLineConfig[] = [];

  readonly linesArray = computed(() => Array.from({ length: this.lines }, (_, i) => i));

  lineSize(index: number): 'sm' | 'md' | 'lg' | 'xl' {
    const config = this.lineConfig[index];
    if (config?.size) return config.size;
    if (index === this.lines - 1 && this.lines > 1) return 'md';
    return 'md';
  }

  lineWidth(index: number): string {
    const config = this.lineConfig[index];
    if (config?.width) return config.width;
    if (index === this.lines - 1 && this.lines > 1) {
      return '65%';
    }
    return '100%';
  }
}
