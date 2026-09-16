import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonShape = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'aether-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    'aria-hidden': 'true',
    'role': 'presentation',
  },
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  @Input() shape: SkeletonShape = 'text';
  @Input() size: SkeletonSize = 'md';
  @Input() customWidth = '';
  @Input() customHeight = '';

  readonly width = computed(() => this.customWidth || this.defaultWidth());
  readonly height = computed(() => this.customHeight || null);

  readonly hostClasses = computed(() => {
    const classes: string[] = [`shape-${this.shape}`, `size-${this.size}`];
    return classes.join(' ');
  });

  private defaultWidth(): string {
    switch (this.shape) {
      case 'text':
        return '100%';
      case 'circular':
        return '';
      default:
        return '100%';
    }
  }
}
