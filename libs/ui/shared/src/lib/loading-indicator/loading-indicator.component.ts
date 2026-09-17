import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkeletonTextComponent } from '../skeleton/skeleton-text.component';

export type LoadingIndicatorVariant = 'spinner' | 'skeleton';
export type LoadingIndicatorSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'aether-loading-indicator',
  standalone: true,
  imports: [SkeletonTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses',
    role: 'status',
    '[attr.aria-label]': 'label',
    '[attr.aria-busy]': 'true',
  },
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {
  @Input() variant: LoadingIndicatorVariant = 'spinner';
  @Input() size: LoadingIndicatorSize = 'md';
  @Input() label = 'Loading';
  @Input() skeletonLines = 3;

  get hostClasses(): string {
    return `${this.variant} size-${this.size}`;
  }
}
